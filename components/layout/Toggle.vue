<template>
  <button
    type="button"
    class="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    role="switch"
    :aria-checked="modelValue ? 'true' : 'false'"
    @click="toggle"
  >
    <span class="sr-only">{{ $title }}</span>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute bg-white w-full h-full rounded-md"
    />
    <span
      aria-hidden="true"
      class="pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
      :class="{
        'bg-green-500': modelValue,
        'bg-gray-200': !modelValue,
      }"
    />
    <span
      aria-hidden="true"
      class="pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
      :class="{
        'translate-x-5': modelValue,
        'translate-x-0': !modelValue,
      }"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
