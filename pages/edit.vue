<script setup lang="ts">
const { t, locales, getBrowserLocale } = useI18n()

useHead({
  title: t('footerlink_edit'),
})

const settings = await useSettings()
const preferedTheme = await usePreferedTheme()
const preferedLocale = usePreferedLocale()

const localesAsOptions = computed(() => {
  const options = locales.value.map((locale) => ({
    text: locale.name,
    value: locale.code,
  }))
  const browserLocale = getBrowserLocale()
  const browserLocaleName = locales.value.find(
    (locale) => locale.code === browserLocale,
  )?.name
  options.unshift({
    text: t('automatic', { name: browserLocaleName }),
    value: 'auto',
  })

  return options
})

const themesAsOptions = [
  'auto',
  'system',
  'light',
  'dark',
  'legacy',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
].map((theme) => ({
  text:
    theme !== 'auto'
      ? theme.charAt(0).toUpperCase() + theme.slice(1)
      : t('automatic', { name: settings.value.portal_theme }),
  value: theme,
}))
</script>

<template>
  <div>
    <PageTitle :text="$t('footerlink_edit')" />

    <div class="lg:flex lg:justify-between">
      <section
        class="lg:w-1/2 lg:me-20 h-full card card-bordered border-base-300 my-10"
      >
        <div class="card-header bg-base-300 py-4 px-8">
          <h2 class="text-3xl">{{ t('edit_personal_settings') }}</h2>
        </div>

        <UserInfoForm class="p-8" />
      </section>

      <section class="lg:w-1/2 card card-bordered border-base-300 my-10">
        <div class="card-header bg-base-300 py-4 px-8">
          <h2 class="text-3xl">{{ $t('change_password') }}</h2>
        </div>

        <UserPasswordForm class="p-8" />
      </section>
    </div>

    <section class="card card-bordered border-base-300 my-10">
      <div class="card-header bg-base-300 py-4 px-8">
        <h2 class="text-3xl">{{ t('edit_browser_settings') }}</h2>
      </div>

      <form class="p-8" novalidate @submit.prevent>
        <div role="group" class="flex flex-wrap align mb-3">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label for="language" class="label me-3">{{ t('language') }}</label>
          <select
            id="language"
            v-model="preferedLocale"
            class="select select-bordered"
          >
            <option disabled selected>{{ t('language') }}</option>
            <option
              v-for="option in localesAsOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <div role="group" class="flex flex-wrap align">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label for="theme" class="label me-3">{{ t('theme') }}</label>
          <select
            id="theme"
            v-model="preferedTheme"
            class="select select-bordered"
          >
            <option disabled selected>{{ t('theme') }}</option>
            <option
              v-for="option in themesAsOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.card .card-header {
  border-top-left-radius: var(--rounded-box);
  border-top-right-radius: var(--rounded-box);
}
</style>
