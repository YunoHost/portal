// AUTH

export const useIsLoggedIn = () => {
  const isLoggedIn = useState<boolean>(
    'isLoggedIn',
    () => localStorage.getItem('isLoggedIn') === 'true',
  )

  return computed({
    get: () => isLoggedIn.value,
    set: (value) => {
      isLoggedIn.value = value
      localStorage.setItem('isLoggedIn', value.toString())
    },
  })
}

// LOCALE

const usePreferedLocaleState = () =>
  useState<string>(
    'preferedLocale',
    () => localStorage.getItem('preferedLocale') || 'auto',
  )

export const usePreferedLocale = () => {
  const preferedLocale = usePreferedLocaleState()
  const { locale, getBrowserLocale, defaultLocale } = useNuxtApp().$i18n

  return computed({
    get: () => preferedLocale.value,
    set: (value) => {
      preferedLocale.value = value
      localStorage.setItem('preferedLocale', value)

      if (value === 'auto') {
        const browserLocale = getBrowserLocale()
        value = browserLocale || defaultLocale
      }

      locale.value = value
    },
  })
}

// THEME

const usePreferedThemeState = () =>
  useState<string>(
    'preferedTheme',
    () => localStorage.getItem('preferedTheme') || 'auto',
  )

export const usePreferedTheme = async () => {
  const preferedTheme = usePreferedThemeState()
  const colorMode = useColorMode()
  const settings = await useSettings()

  return computed({
    get: () => preferedTheme.value,
    set: (value) => {
      preferedTheme.value = value
      localStorage.setItem('preferedTheme', value)

      if (value === 'auto') {
        value = settings.value.portal_theme
      }

      colorMode.preference = value
    },
  })
}

export const useRedirectUrl = () =>
  useState<string | null>('redirectUrl', () => null)

export const useQueryMsg = () => useState<string | null>('queryMsg', () => null)

// SETTINGS

type AppsSettings = Record<
  string,
  {
    label: string
    url: string
    description?: Record<string, string>
    logo?: string
  }
>

export interface Settings {
  domain: string
  public: boolean
  portal_logo?: { is: 'img' | 'svg'; src: string }
  portal_theme: string
  portal_title?: string
  search_engine?: string
  search_engine_name?: string
  show_other_domains_apps: 0 | 1
  portal_user_intro: string
  portal_public_intro: string
  apps: AppsSettings
}

const useSettingsState = () => useState<Settings>('settings')

export const useSettings = async () => {
  const settings = useSettingsState()

  if (!settings.value) {
    const { data } = await useApi<Settings>('/public')

    const logo = data.value!.portal_logo as unknown as string | undefined
    if (logo) {
      const src = `https://${data.value!.domain}/yunohost/sso/customassets/${logo}`
      const is = logo.slice(-4) === '.svg' ? 'svg' : 'img'
      data.value!.portal_logo = { is, src: is === 'svg' ? '' : src }

      if (is === 'svg') {
        // Query file content to inject inline SVG so that CSS "currentColor" can cascade to it
        $fetch<Blob>(src)
          .then((blob) => blob.text())
          .then((text) => {
            data.value!.portal_logo!.src = text.replace(
              '<?xml version="1.0" encoding="utf-8"?>',
              '',
            )
          })
      }
    }

    settings.value = data.value as Settings

    const colorMode = useColorMode()
    colorMode.preference = settings.value.portal_theme
  }

  return settings
}

// USER

export interface User {
  username: string
  fullname: string
  mail: string
  mailalias: string[]
  mailforward: string[]
  groups: string[]
  apps: AppsSettings
}

export const useUserState = () => useState<User | null>('user', () => null)

export const useUser = async <T extends User | null = User>() => {
  const user = useUserState()
  const isLoggedIn = useIsLoggedIn()

  if (!user.value && isLoggedIn.value) {
    const { data } = await useApi<T>('/me')
    user.value = data.value
  }

  return user as Ref<T>
}

// APP

export const useApps = async () => {
  const isLoggedIn = useIsLoggedIn()
  const settings = await useSettings()
  const user = await useUser()

  return computed(() => {
    return isLoggedIn.value ? user.value?.apps : settings.value.apps
  })
}
