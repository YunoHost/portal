<script setup lang="ts">
import { useFieldArray } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  inputLabel: string
  buttonLabel: string
  type: HTMLInputElement['type']
  placeholder?: string
  disabled: boolean
}>()

const group: Ref<HTMLElement | null> = ref(null)
const { remove, push, fields } = useFieldArray(props.name)

function onAdd() {
  push('')
  nextTick(() => {
    // auto focus new input
    const inputs = group.value?.querySelectorAll('input')
    if (inputs && inputs.length) {
      inputs[inputs.length - 1].focus()
    }
  })
}
</script>

<template>
  <fieldset ref="group">
    <legend class="text-xl mb-3">{{ label }}</legend>

    <FormField
      v-for="(field, idx) in fields"
      :key="field.key"
      :name="`${name}[${idx}]`"
      :label="inputLabel"
      class="mb-3"
      sr-hide-label
    >
      <div class="join w-full">
        <TextInput
          :name="`${name}[${idx}]`"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          class="join-item w-full"
        />
        <YButton
          variant="error"
          icon="delete-forever"
          icon-size="2em"
          icon-only
          :text="$t('remove')"
          class="join-item px-3"
          @click="remove(idx)"
          v-if="!disabled"
        />
      </div>
    </FormField>

    <YButton :text="buttonLabel" @click="onAdd" v-if="!disabled"/>
  </fieldset>
</template>
