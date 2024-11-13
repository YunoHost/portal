<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

definePageMeta({
  layout: false,
  public: true,
})

const { t } = useI18n()

useHead({
  title: t('login'),
})

const isLoggedIn = useIsLoggedIn()
const redirectUrl = useRedirectUrl()
const queryMsg = useQueryMsg()

const { handleSubmit, setErrors } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
  ),
})

const login = handleSubmit(async (form) => {
  const { error } = await useApi('/login', {
    method: 'POST',
    body: { credentials: form.username + ':' + form.password },
  })

  if (!error.value) {
    if (redirectUrl.value) {
      await navigateTo(atob(redirectUrl.value), { external: true })
    }

    isLoggedIn.value = true
    await navigateTo('/')
  } else {
    setErrors({
      username: t('possibly_invalid_username'),
      password: t('possibly_invalid_password'),
    })
  }
})
</script>

<template>
  <main class="w-50 m-auto max-w-[300px]">
    <CustomLogo class="flex-none mx-auto w-1/2 mb-10" />

    <BaseAlert
      v-if="redirectUrl"
      variant="warning"
      icon="alert-outline"
      :message="t('ssowat.protected')"
      class="mb-4"
      assertive
    />

    <BaseAlert
      v-if="queryMsg"
      variant="info"
      icon="login"
      :message="t(queryMsg)"
      class="mb-4"
      assertive
    />

    <form novalidate @submit="login">
      <FormField
        name="username"
        :label="t('username')"
        icon="account-circle"
        class="mb-4"
        row
      >
        <TextInput
          name="username"
          type="text"
          :placeholder="t('username')"
          autocomplete="username"
          autocapitalize="off"
          spellcheck="false"
          class="w-full"
        />
      </FormField>

      <FormField
        name="password"
        :label="t('password')"
        icon="lock"
        class="mb-4"
        row
      >
        <TextInput
          name="password"
          type="password"
          :placeholder="t('password')"
          autocomplete="current-password"
          class="w-full"
        />
      </FormField>

      <YButton :text="t('login')" type="submit" block />
    </form>
  </main>
</template>
