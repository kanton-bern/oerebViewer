<template>
  <div>
    <Multiselect
      id="ajax"
      ref="vms"
      class="search-dropdown"
      select-label=""
      :value="$store.state.map.selectedSearchResult"
      label="label"
      track-by="id"
      :placeholder="$t('search_placeholder')"
      open-direction="bottom"
      :options="$store.state.map.searchResults"
      :multiple="false"
      :searchable="true"
      :loading="$store.state.map.isSearchResultLoading"
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
      @search-change="internalSearchChanged"
      @select="searchResultSelected"
    >
      <template slot="clear" slot-scope="props">
        <div
          v-if="$store.state.map.selectedSearchResult"
          class="multiselect__clear"
          @mousedown.prevent.stop="clearAll(props.search)"
        />
      </template>
      <template v-if="isHtmlFormatted" slot="singleLabel" slot-scope="props">
        <span class="option__title" v-html="props.option.label" />
      </template>
      <template v-if="isHtmlFormatted" slot="option" slot-scope="props">
        <span class="option__title" v-html="props.option.label" />
      </template>
      <span slot="noResult">{{ $t('no_search_result') }}</span>
      <span slot="noOptions">{{ $t('search_list_empty') }}</span>
    </Multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapActions } from 'vuex'
import { debounce } from 'lodash'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { searchService } from '~/config/setup'

export default {
  components: { Multiselect },
  data() {
    return {
      isHtmlFormatted: searchService.isHtmlFormatted,
    }
  },

  mounted() {
    this.focus()
  },

  methods: {
    ...mapActions('map', ['updateSearchQuery', 'searchResultSelected']),

    limitText(count) {
      return `and ${count} other countries`
    },

    formatLabel(item) {
      if (item) {
        return item.label
      }

      return ''
    },

    internalSearchChanged(query) {
      this.searchChanged(query)
    },

    searchChanged: debounce(function (input) {
      this.updateSearchQuery(input)
    }, 300),

    clearAll() {
      this.searchResultSelected(null)
    },

    focus() {
      this.$refs.vms.$el.focus()
    },
  },
}
</script>

<style lang="scss">
.search-dropdown {
  width: 500px;
  max-width: calc(100vw - 5.5rem);

  .multiselect__content-wrapper {
    @apply bg-theme-primary text-theme-primary bg-opacity-90 border-none;

    .multiselect__content {
      .multiselect__option--highlight {
        @apply bg-white bg-opacity-10;
      }
    }
  }

  .multiselect__tags {
    min-height: 44px;
    @apply px-3 py-0 bg-theme-primary text-theme-primary bg-opacity-90 rounded border-none text-base flex items-center;

    .multiselect__single {
      @apply text-theme-primary bg-transparent hover:bg-transparent;
      margin: 0;
      padding: 0;
    }

    .multiselect__input {
      @apply text-theme-primary bg-transparent hover:bg-transparent;
      margin: 0;
      padding: 0;
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box; /* Firefox, other Gecko */
      box-sizing: border-box; /* Opera/IE 8+ */
    }

    .multiselect__placeholder {
      @apply text-theme-primary;
      margin: 0;
      padding: 0;
    }

    .multiselect__input::placeholder {
      @apply text-theme-primary;
    }
    .multiselect__spinner {
      @apply bg-theme-primary rounded;
      top: 0px;
      right: 0px;
      height: 44px;
      width: 44px;
    }
  }
}
</style>
