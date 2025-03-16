<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Hymn } from '../models/hymn'
import sHymn from '../services/HymnService'
import BasicDialog from './BasicDialog.vue'
import ListIcon from './icons/ListIcon.vue'
import PlayIcon from './icons/PlayIcon.vue'
import { debounce } from '../utils/debounce'
import InputText from './commons/InputText.vue'
import BaseButton from './commons/BaseButton.vue'

const emit = defineEmits(['onPlayHymn'])

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)
const hymns = ref<Hymn[]>([])
const filteredHymns = ref<Hymn[]>([])
const search = ref('')

onMounted(() => {
  list()
})

async function list() {
  const data = await sHymn.all()
  hymns.value = filteredHymns.value = data
}

function searchHymn(hymnNumber: number) {
  emit('onPlayHymn', hymnNumber)
  dialog.value?.close()
}

const debouncedFilterHymns = debounce(filterHymns, 300)

function filterHymns() {
  if (search.value.length > 0) {
    filteredHymns.value = hymns.value.filter((hymn) => {
      const parsedNumber = String(hymn.number)
      const parsedTitle = normalizeWord(hymn.title.toLowerCase())
      const parsedSearch = normalizeWord(search.value.toLowerCase())
      return (
        parsedNumber.includes(parsedSearch) ||
        parsedTitle.includes(parsedSearch)
      )
    })
  } else {
    filteredHymns.value = hymns.value
  }
}

function normalizeWord(word: string) {
  return word
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .normalize('NFC')
}
</script>

<template>
  <BaseButton
    class="w-8 h-8"
    title="Lista de himnos"
    @click="dialog?.open"
  >
    <ListIcon />
  </BaseButton>
  <BasicDialog ref="dialog" title="" class="h-full">
    <template v-slot:header>
      <InputText
        v-model="search"
        id="search"
        type="search"
        placeholder="Buscar himno"
        data-test="search-hymn"
        @input="debouncedFilterHymns"
      />
    </template>
    <div class="space-y-1">
      <button
        v-for="hymn in filteredHymns"
        :key="hymn.id"
        class="bg-[#F3F3F3] dark:bg-[#3C404B] hover:bg-[#FEFEFF] dark:hover:bg-[#4F535E] w-full flex items-stretch rounded-sm divide-x divide-[#E5E5E5] dark:divide-[#2B2E38]"
        type="button"
        data-test="hymn-item"
        @click="searchHymn(hymn.number)"
      >
        <div class="px-2 py-1">
          {{ String(hymn.number).padStart(3, '0') }}
        </div>
        <div class="px-2 py-1 grow text-start">
          {{ hymn.title }}
        </div>
        <div class="px-2 w-7 self-stretch flex-shrink-0 flex items-center">
          <PlayIcon class="w-6 h-6" />
        </div>
      </button>
    </div>
  </BasicDialog>
</template>
