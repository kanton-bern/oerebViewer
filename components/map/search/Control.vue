<template>
  <div>
    <Multiselect
      id="ajax"
      ref="vms"
      class="search-dropdown"
      select-label=""
      :model-value="mapStore.selectedSearchResult"
      label="label"
      track-by="id"
      :placeholder="$t('search_placeholder')"
      open-direction="bottom"
      :options="mapStore.searchResults"
      :multiple="false"
      :searchable="true"
      :loading="mapStore.isSearchResultLoading"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="false"
      :options-limit="300"
      :limit="3"
      :limit-text="limitText"
      :max-height="600"
      :show-no-results="false"
      :hide-selected="true"
      :show-labels="false"
      :custom-label="formatLabel"
      @update:model-value="searchResultSelected"
      @search-change="internalSearchChanged"
    >
      <template #clear="props">
        <div
          v-if="mapStore.selectedSearchResult"
          class="multiselect__clear"
          @mousedown.prevent.stop="clearAll(props.search)"
        />
      </template>
      <template v-if="isHtmlFormatted" #singleLabel="props">
        <span class="option__title" v-html="props.option.label" />
      </template>
      <template v-if="isHtmlFormatted" #option="props">
        <span class="option__title" v-html="props.option.label" />
      </template>
      <template #noResult>{{ $t('no_search_result') }}</template>
      <template #noOptions>{{ $t('search_list_empty') }}</template>
    </Multiselect>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { getSearchService } from '~/config/setup'
import { useMapStore } from '~/store/map'

const debounce = (fn, wait = 300) => {
  let timeoutId
  let lastExecTime = 0

  return (...args) => {
    const execute = () => {
      fn(...args)
      lastExecTime = Date.now()
    }

    const later = () => {
      const timeSinceLastExec = Date.now() - lastExecTime
      if (timeSinceLastExec >= wait) {
        execute()
      } else {
        timeoutId = requestAnimationFrame(later)
      }
    }

    cancelAnimationFrame(timeoutId)
    timeoutId = requestAnimationFrame(later)
  }
}

const mapStore = useMapStore()

const searchService = await getSearchService()

const vms = ref(null)
const isHtmlFormatted = ref(searchService.isHtmlFormatted)

const limitText = (count) => {
  return `and ${count} other countries`
}

const formatLabel = (item) => {
  if (item) {
    return item.label
  }
  return ''
}

const internalSearchChanged = (query) => {
  searchChanged(query)
}

const searchChanged = debounce((input) => {
  mapStore.updateSearchQuery(input)
}, 300)

const clearAll = () => {
  mapStore.searchResultSelected(null)
}

const focus = () => {
  vms.value.$el.focus()
}

const searchResultSelected = (result) => {
  mapStore.searchResultSelected(result)
}

onMounted(() => {
  focus()
})
</script>

<style>
.search-dropdown {
  width: 500px;
  max-width: calc(100vw - 5.5rem);

  & .multiselect__content-wrapper {
    @apply bg-theme-primary text-theme-primary bg-opacity-90 border-none;

    & .multiselect__content {
      & .multiselect__option--highlight {
        @apply bg-white bg-opacity-10;
      }
    }
  }

  & .multiselect__tags {
    min-height: 44px;
    @apply px-3 py-0 bg-theme-primary text-theme-primary bg-opacity-90 rounded border-none text-base flex items-center;

    & .multiselect__single {
      @apply text-theme-primary bg-transparent hover:bg-transparent;
      margin: 0;
      padding: 0;
    }

    & .multiselect__input {
      @apply text-theme-primary bg-transparent hover:bg-transparent;
      margin: 0;
      padding: 0;
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box; /* Firefox, other Gecko */
      box-sizing: border-box; /* Opera/IE 8+ */
    }

    & .multiselect__placeholder {
      @apply text-theme-primary;
      margin: 0;
      padding: 0;
    }

    & .multiselect__input::placeholder {
      @apply text-theme-primary;
    }
    & .multiselect__spinner {
      @apply bg-theme-primary rounded;
      top: 0px;
      right: 0px;
      height: 44px;
      width: 44px;
    }
  }
}
</style>
