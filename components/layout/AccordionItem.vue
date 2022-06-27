<template>
  <div class="accordion-item" :class="{ expanded: isActive, decent: isDecent }">
    <div
      v-if="disabled"
      :id="'accordion-label-' + id"
      :aria-expanded="isActive"
      :aria-controls="'accordion-item-' + id"
      class="accordion-item__header"
    >
      <div class="flex-1" :class="headerClass">
        {{ header }}
      </div>

      <div class="flex">
        <div
          v-if="tag || tag === 0"
          class="bg-theme-primary text-theme-primary rounded-full h-5 w-5 text-xs 3xl:h-6 3xl:w-6 3xl:text-sm font-light flex justify-center items-center"
        >
          {{ tag }}
        </div>
      </div>
    </div>
    <button
      v-else
      :id="'accordion-label-' + id"
      :aria-expanded="isActive"
      :aria-controls="'accordion-item-' + id"
      class="accordion-item__header"
      @click.prevent="toggle"
    >
      <div class="flex-1" :class="headerClass">
        {{ header }}
      </div>

      <div class="flex">
        <div
          v-if="tag || tag === 0"
          class="bg-theme-primary text-theme-primary rounded-full h-5 w-5 text-xs 3xl:h-6 3xl:w-6 3xl:text-sm font-light flex justify-center items-center"
        >
          {{ tag }}
        </div>
      </div>
    </button>
    <div v-if="isActive" class="accordion-item__wraper">
      <div
        :id="'accordion-item-' + id"
        :aria-labelledby="'accordion-label-' + id"
        role="region"
        :hidden="!isActive"
        class="accordion-item__content"
      >
        <slot :open="isActive" />
      </div>
    </div>
  </div>
</template>

<script>
import decent from '~/mixins/decent'

export default {
  mixins: [decent],

  inject: ['accordionActiveItem'],

  props: {
    header: {
      type: String,
      required: true,
    },

    headerClass: {
      type: String,
      default: '',
    },

    tag: {
      type: [String, Number],
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    id: {
      type: String,
      default() {
        return `accordion-item-${this._uid}`
      },
    },
  },

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

    isActive() {
      return this.accordionActiveItem.value === this.id
    },
  },

  methods: {
    toggle() {
      this.accordion.$emit('item-clicked', this.id)
    },
  },
}
</script>
