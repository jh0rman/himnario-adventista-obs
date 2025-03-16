<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    placeholder?: string
    type?: string
  }>(),
  {
    type: 'text',
  },
)

const value = defineModel()
</script>

<template>
  <input
    v-model="value"
    v-bind="$attrs"
    :id
    :placeholder
    :type
    class="text-sm rounded-sm px-2 py-1 outline-hidden bg-white dark:bg-[#454A56]"
  >
</template>
