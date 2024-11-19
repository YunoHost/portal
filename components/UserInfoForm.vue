<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { exclude, pick } from '@/utils/common'
import type { User } from '@/composables/states'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()

const user = await useUser()
const settings = await useSettings()
const loading: Ref<boolean> = ref(false)
const feedback: Ref<Feedback> = ref(null)

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      fullname: yup.string().required().min(2),
      mail: yup.string(),
      mailalias: yup.array().of(yup.string().email().required()).required(),
      mailforward: yup.array().of(yup.string().email().required()).required(),
    }),
  ),
  initialValues: {
    ...pick(user.value, 'fullname', 'mail', 'mailalias', 'mailforward'),
  },
})

watch(
  () => meta.value.dirty,
  (value) => {
    // remove global feedback on edition
    if (value) {
      feedback.value = null
    }
  },
)

const onSubmit = handleSubmit(async (form) => {
  loading.value = true

  let excludedFields = []
  if (!settings.value.allow_edit_email) {
    excludedFields.push('email')
  }
  if (!settings.value.allow_edit_email_alias) {
    excludedFields.push('mailalias')
  }
  if (!settings.value.allow_edit_email_forward) {
    excludedFields.push('mailforward')
  }

  const { error, data } = await useApi<
    Pick<User, 'fullname' | 'mail' | 'mailalias' | 'mailforward'>
  >('/update', {
    method: 'PUT',
    body: exclude(form, ...excludedFields),
  })

  if (error.value) {
    // Reset form dirty state but keep previous values
    resetForm({ values: { ...form, mail: user.value.mail } })
    const errData = error.value.data
    let message

    if (errData.path) {
      setFieldError(errData.path, errData.error)
      message = t('form_has_errors')
    } else {
      message = errData.error || errData
    }
    feedback.value = {
      variant: 'error',
      icon: 'alert',
      message,
    }
  } else if (data.value) {
    Object.assign(user.value, data.value)
    resetForm({
      values: { ...data.value, mail: user.value.mail },
    })
    feedback.value = {
      variant: 'success',
      icon: 'thumb-up',
      message: t('user_profile_updated'),
    }
  }

  loading.value = false
})
</script>

<template>
  <YForm :loading="loading" :feedback="feedback" @submit.prevent="onSubmit">
    <FormField name="fullname" :label="$t('fullname')" class="mb-10">
      <TextInput
        name="fullname"
        type="text"
        :placeholder="$t('fullname')"
        autocomplete="name"
        class="w-full"
      />
    </FormField>

    <FormField name="mail" :label="$t('primary_mail_adress')" class="mb-10">
      <TextInput name="mail" type="text" class="w-full" :disabled="!settings.allow_edit_email" />
    </FormField>

    <TextInputList
      name="mailalias"
      type="email"
      :label="$t('mail_addresses')"
      :input-label="$t('mail_address')"
      :button-label="$t('add_mail')"
      :placeholder="$t('new_mail')"
      class="mb-10"
      :disabled="!settings.allow_edit_email_alias"
    />

    <TextInputList
      name="mailforward"
      type="email"
      :label="$t('mail_forwards')"
      :input-label="$t('mail_forward')"
      :button-label="$t('add_forward')"
      :placeholder="$t('new_forward')"
      :disabled="!settings.allow_edit_email_forward"
    />
  </YForm>
</template>
