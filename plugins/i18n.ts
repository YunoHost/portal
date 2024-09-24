import { setLocale } from 'yup'
import { usePreferedTheme } from '@/composables/states'

export default defineNuxtPlugin({
  async setup() {
    // Override default yup errors
    // https://github.com/jquense/yup/blob/master/src/locale.ts
    setLocale({
      mixed: {
        default: 'v.field_invalid',
        required: 'v.field_required',
      },
      string: {
        email: 'v.email',
        min: ({ min }) => ({ key: 'v.string_too_short', values: { min } }),
      },
    })

    const preferedTheme = await usePreferedTheme()
    const colorMode = useColorMode()
    if (preferedTheme.value !== 'auto') {
      colorMode.preference = preferedTheme.value
    }
  },
})
