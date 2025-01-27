<script setup lang="ts">
import { useFieldError } from 'vee-validate'
import { formGroupExtras } from '@/composables/form'

const props = defineProps<{
  name: string
  label: string
  icon?: string
  description?: string
  row?: boolean
  srHideLabel?: boolean
}>()

const { t } = useI18n()
const errorMessage = useFieldError(() => props.name)
const invalid = computed(() => !!errorMessage.value)
const describedBy = computed(() => {
  return (
    [
      props.description ? props.name + '__description' : null,
      invalid.value ? props.name + '__feedback_invalid' : null,
    ]
      .filter((x) => x)
      .join(' ') || undefined
  )
})

const error = computed(() => {
  const e = errorMessage.value as
    | string
    | undefined
    | { key: string; values: Record<string, any> }
  if (!e) return ''
  if (typeof e === 'string') return t(e)
  return t(e.key, e.values)
})

provide(formGroupExtras, {
  describedBy,
  invalid,
})
</script>

<template>
  <div>
    <div
      role="group"
      :aria-invalid="invalid"
      :class="{ 'is-invalid': invalid, 'flex-col': !row, 'items-center': row }"
      class="flex"
    >
      <slot name="label">
        <!-- eslint-disable vuejs-accessibility/label-has-for -->
        <label
          :id="name + '__label'"
          :for="name"
          class="block ms-1"
          :class="{ 'sr-only': srHideLabel, flex: !!icon, 'mb-2': !icon }"
        >
          <YIcon
            v-if="icon"
            :name="icon"
            aria-hidden="true"
            size="2em"
            class="me-2"
          />
          <span :class="{ 'sr-only': !!icon }">{{ label }}</span>
        </label>
      </slot>

      <div class="w-full">
        <slot name="default" />

        <div
          v-show="invalid"
          :id="name + '__feedback_invalid'"
          tabindex="-1"
          aria-live="assertive"
          aria-atomic="true"
          class="text-error mt-1"
        >
          {{ error }}
        </div>
        <small
          v-if="description"
          :id="name + '__description'"
          tabindex="-1"
          class="block text-gray-400 mt-1"
        >
          {{ description }}
        </small>
      </div>
    </div>
  </div>
</template>
