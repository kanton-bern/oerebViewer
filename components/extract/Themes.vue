<template>
  <div v-if="loadedExtract">
    <LayoutAccordionItem
      id="accordion-item-concerned-themes"
      :header="$t('detail_concerned_themes')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.ConcernedTheme.length"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.ConcernedTheme"
          :key="`active-${theme.Code}`"
          :header="theme.Text | multilingualtext"
        >
          <ExtractTheme :code="theme.Code" />
        </LayoutAccordionItem>
      </LayoutAccordion>
    </LayoutAccordionItem>

    <LayoutAccordionItem
      :header="$t('detail_no_restrictions')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.NotConcernedTheme.length"
      :decent="true"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.NotConcernedTheme"
          :key="`inactive-${theme.Code}`"
          :header="theme.Text | multilingualtext"
          :disabled="true"
        />
      </LayoutAccordion>
    </LayoutAccordionItem>

    <LayoutAccordionItem
      :header="$t('detail_missing_restrictions')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.ThemeWithoutData.length"
      :decent="true"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.ThemeWithoutData"
          :key="`nodata-${theme.Code}`"
          :header="theme.Text | multilingualtext"
          :disabled="true"
        />
      </LayoutAccordion>
    </LayoutAccordionItem>
  </div>
</template>

<script>
import loadedextract from '~/mixins/loadedextract'

export default {
  mixins: [loadedextract],

  computed: {
    accordion() {
      const findAccordion = (parent, up = 3) =>
        parent &&
        (typeof parent.accordion === 'boolean' && parent.accordion
          ? parent
          : up && findAccordion(parent.$parent, up - 1))
      const parent = findAccordion(this.$parent)
      if (!parent) throw new Error('AccordionItem requires Accordion as parent')
      return parent
    },
  },

  watch: {
    loadedExtract(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.openActiveTheme()
      }
    },
  },

  methods: {
    openActiveTheme() {
      this.accordion.$emit('item-show', 'accordion-item-concerned-themes')
    },
  },
}
</script>
