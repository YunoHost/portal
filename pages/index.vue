<script setup lang="ts">
definePageMeta({
  public: true,
})

const { t, locale } = useI18n()
const isLoggedIn = await useIsLoggedIn()
const settings = await useSettings()
const appsData = await useApps()

useHead({
  title: t('app_list'),
})

const intro = computed(() => {
  const {
    portal_user_intro: userIntro,
    portal_public_intro: publicIntro,
    public: isPublic,
  } = settings.value
  return isLoggedIn.value ? userIntro : isPublic ? publicIntro : null
})

const apps = Object.values(appsData.value).map((app) => {
  return {
    ...app,
    url: '//' + app.url,
    description: app.description?.[locale.value] || app.description?.en,
  }
})

const search = ref('')

async function onSearchSubmit() {
  await navigateTo(settings.value.search_engine + search.value, {
    open: {
      target: '_blank',
    },
  })
}
</script>

<template>
  <div>
    <CustomText v-if="intro" :content="intro" />

    <form v-if="settings.search_engine" class="flex my-16" @submit.prevent>
      <div class="join w-full max-w-xl mx-auto">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label for="search" class="sr-only">
          {{
            t('search_engine_placeholder', {
              engine: settings.search_engine_name,
            })
          }}
        </label>
        <input
          id="search"
          v-model="search"
          type="search"
          class="input input-bordered join-item w-full"
          name="search"
          :placeholder="
            t('search_engine_placeholder', {
              engine: settings.search_engine_name,
            })
          "
        />
        <button
          type="submit"
          class="btn btn-primary join-item px-2"
          @click="onSearchSubmit"
        >
          <YIcon name="magnify" aria-hidden="true" class="m-0" />
          <span class="sr-only">{{ t('search') }}</span>
        </button>
      </div>
    </form>

    <section id="apps" class="my-16">
      <PageTitle :text="t('app_list')" tag="h2" sr-only class="mb-4" />

      <div v-if="!apps.length">
        <em>{{ t('no_apps') }}</em>
      </div>
      <ul v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <li
          v-for="app in apps"
          :key="app.label"
          class="flex text-align flex-auto btn btn-outline btn-neutral !h-auto p-5 relative flex-nowrap items-start justify-normal text-left font-normal"
        >
          <img
            v-if="app.logo"
            aria-hidden
            :src="app.logo"
            class="w-24 h-24 rounded me-4 bg-white"
            alt=""
          />
          <div>
            <h4 class="text-xl font-bold">
              <a :href="app.url" class="">{{ app.label }}</a>
            </h4>
            <div v-if="app.description" v-html="app.description" />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.grid li a::after {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
</style>
