<script setup lang="ts">
import AdminPanel from './components/AdminPanel.vue'
</script>

<template>
  <AdminPanel />
</template>

<style>
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root:where(.dark, .dark *) {
  color-scheme: light dark;
}

@utility audio-light {
  &::-webkit-media-controls-panel {
    background: #F5F5F5;
  }
}

@utility audio-dark {
  &::-webkit-media-controls-panel {
    background: #3C404B;
  }
}
</style>
