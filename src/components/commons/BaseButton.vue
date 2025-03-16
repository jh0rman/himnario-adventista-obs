<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    type?: HTMLButtonElement['type']
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <button
    :title
    :type
    class="rounded-sm px-2 py-1 bg-[#F3F3F3] hover:bg-[#FEFEFF] active:bg-[#C1C1C1] dark:bg-[#3C404B] dark:hover:bg-[#4F535E] dark:active:bg-[#191B26] disabled:opacity-50 disabled:pointer-events-none"
  >
    <slot />
  </button>
</template>
