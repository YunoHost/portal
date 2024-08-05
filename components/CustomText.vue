<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <section class="intro" v-html="content" />
</template>

<style>
.intro {
  @apply mt-4;
}

.intro p {
  @apply mb-4;
}

.intro a {
  @apply link;
  @apply font-normal;
}

.intro em {
  @apply italic;
}
.intro strong {
  @apply font-bold;
}

.intro ul,
.intro ol {
  @apply list-disc list-inside mb-4;
}
.intro ol {
  @apply list-decimal;
}

.intro dt {
  @apply font-bold;
}
.intro dd {
  @apply mb-1;
}
.intro dd:last-of-type {
  @apply mb-4;
}

.intro h1 {
  @apply text-6xl font-bold my-10 text-center;
}
.intro h2 {
  @apply text-5xl font-bold my-10;
}
.intro h3 {
  @apply text-4xl font-medium my-6;
}
.intro h4 {
  @apply text-3xl font-bold my-4;
}
.intro h5 {
  @apply text-2xl my-3;
}
.intro h6 {
  @apply text-xl font-bold my-2;
}

.intro blockquote {
  @apply px-4 my-6;
}

.intro img,
.intro video {
  @apply my-6;
}
</style>
