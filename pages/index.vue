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
    label_hash: parseInt(app.label.replaceAll(' ', ''), 36) % 10000,
    initials: app.label.substring(0, 2),
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

const tileClasses = computed(() => {
  return {
    descriptive: {
      container: 'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
      img: 'me-4',
      title: 'text-xl leading-6 font-bold',
    },
    simple: {
      tile: 'flex-col text-center text-xl leading-6 font-bold items-center',
    },
    periodic: {
      container: '',
      tile: 'flex-col p-3 items-center',
      title: 'leading-6 text-center text-base',
    },
  }[settings.value.portal_tile_theme]
})
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
      <ul
        v-else
        id="app-tiles"
        class="theme-descriptive grid gap-4"
        :class="[settings.portal_tile_theme, tileClasses.container]"
      >
        <li
          v-for="app in apps"
          :key="app.label"
          class="app-tile flex text-align flex-auto btn btn-dark !h-auto p-5 relative flex-nowrap items-start justify-normal text-left font-normal"
          :class="tileClasses.tile"
          :style="`--label-hash: ${app.label_hash}`"
        >
          <img
            v-if="app.logo && settings.portal_tile_theme !== 'periodic'"
            aria-hidden
            :src="app.logo"
            class="app-logo w-24 h-24 min-w-24 rounded bg-white"
            :class="tileClasses.img"
            alt=""
          />
          <div>
            <h4
              :data-initials="app.initials"
              class="app-label break-all"
              :class="tileClasses.title"
            >
              <a :href="app.url" class="">{{ app.label }}</a>
            </h4>
            <p
              v-if="
                app.description && settings.portal_tile_theme === 'descriptive'
              "
              class="app-description mt-2"
              v-html="app.description"
            />
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

#app-tiles.simple {
  grid-template-columns: repeat(auto-fill, 180px);
  grid-template-rows: repeat(auto-fill, minmax(180px, 1fr));
}

#app-tiles.periodic {
  grid-template-columns: repeat(auto-fill, 160px);
  grid-template-rows: repeat(auto-fill, 10rem);
}

#app-tiles.periodic .app-tile {
  min-height: 10rem;
  border-radius: 0.3em !important;
  --app-tile-colors: #f94144, #f3722c, #f8961e, #f9844a, #f9c74f, #90be6d,
    #43aa8b, #4d908e, #577590, #277da1;
  --app-tile-colors-n: 10;
  color: white;
  --i: mod(var(--label-hash), var(--app-tile-colors-n));
  background: linear-gradient(var(--app-tile-colors)) no-repeat 0
    calc(var(--i) * 100% / (var(--app-tile-colors-n) - 1)) / 100%
    calc(1px * infinity);
}
#app-tiles.periodic .app-label:before {
  content: attr(data-initials);
  display: block;
  font-size: 5em;
  font-weight: 700;
  padding-top: 0.5em;
  padding-bottom: 0.3em;
}
</style>
