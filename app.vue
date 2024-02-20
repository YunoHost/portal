<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})

const settings = await useSettings()

useHead({
  titleTemplate: (titleChunk) => {
    const baseTitle = settings.value.portal_title
    return titleChunk ? `${titleChunk} - ${baseTitle}` : baseTitle
  },
})
</script>

<template>
  <NuxtLayout>
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir" />

    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  font-family: 'Source Sans 3';
}

#__nuxt {
  @apply min-h-screen flex;
}

/* GLOBAL */
.btn,
.select,
.input.input,
.join-item.btn {
  min-height: 2.5rem;
  height: 2.5rem;
}
</style>
