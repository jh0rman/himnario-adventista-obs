<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Hymn } from '../models/hymn'
import sHymn from '../services/HymnService'
import BasicDialog from './BasicDialog.vue'
import ListIcon from './icons/ListIcon.vue'
import PlayIcon from './icons/PlayIcon.vue'
import { debounce } from '../utils/debounce'

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
  <button @click="dialog!.open" title="Lista de himnos" type="button" class="btn w-8 h-8">
    <ListIcon />
  </button>
  <BasicDialog ref="dialog" title="" class="h-full">
    <template v-slot:header>
      <input v-model="search" @input="debouncedFilterHymns" type="search" class="input__text" id="search" placeholder="Buscar himno" data-test="search-hymn" />
    </template>
    <div class="space-y-1">
      <button @click="searchHymn(hymn.number)" v-for="hymn in filteredHymns" :key="hymn.id" type="button" class="bg-light-button-bg dark:bg-dark-button-bg hover:bg-light-button-hover dark:hover:bg-dark-button-hover w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background" data-test="hymn-item">
        <div class="px-2 py-1">
          {{ String(hymn.number).padStart(3, '0') }}
        </div>
        <div class="px-2 py-1 grow text-start">
          {{ hymn.title }}
        </div>
        <div class="px-2 w-7 self-stretch flex-shrink-0 flex items-center">
          <PlayIcon />
        </div>
      </button>
    </div>
  </BasicDialog>
</template>
