<script setup lang="ts">
defineProps<{
  id?: string
}>()

const value = defineModel()
</script>

<template>
  <select v-model="value" :id class="text-sm rounded-sm px-2 py-1 outline-hidden bg-white dark:bg-[#454A56]">
    <slot />
  </select>
</template>
