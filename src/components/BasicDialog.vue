<script setup lang="ts">
import { ref } from 'vue'
import CloseIcon from './icons/CloseIcon.vue'
import BaseButton from './commons/BaseButton.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
})

defineExpose({
  open,
  close,
})

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="backdrop:bg-black/50 w-full max-w-[280px] rounded-lg bg-[#E5E5E5] dark:bg-[#2B2E38] text-black dark:text-white m-auto">
    <div class="sticky top-0 inline-flex items-center bg-[#E5E5E5] dark:bg-[#2B2E38] border-b border-[#C1C1C1] dark:border-[#4F535E] p-4 py-3 w-full text-base z-10">
      <h1 class="font-bold leading-none">
        {{ title }}
      </h1>
      <slot name="header"></slot>
      <BaseButton
        class="w-7 h-7 flex-shrink-0 ms-auto"
        title="Cerrar"
        @click="close"
      >
        <CloseIcon />
      </BaseButton>
    </div>
    <div class="p-4 py-3 text-sm">
      <slot></slot>
      <div class="flex text-base">
        <slot name="footer"></slot>
      </div>
    </div>
  </dialog>
</template>