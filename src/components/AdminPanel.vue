<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useHymn } from '../composables/hymn'
import { useObs } from '../composables/obs'
import { usePlayer } from '../composables/player'
import { store } from '../store'
import AboutApp from './AboutApp.vue'
import AutodriveButton from './AutodriveButton.vue'
import HymnSearcher from './HymnSearcher.vue'
import SettingsPanel from './SettingsPanel.vue'
import SetupScene from './SetupScene.vue'
import HomeIcon from './icons/HomeIcon.vue'
import NextIcon from './icons/NextIcon.vue'
import PreviousIcon from './icons/PreviousIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'
import StopIcon from './icons/StopIcon.vue'
import InputText from './commons/InputText.vue'
import BaseButton from './commons/BaseButton.vue'

const {
  connect,
  disconnect,
  connected,
  setCurrentScene,
  setSourceVisibility,
  setSourceText,
} = useObs()

const { hymnIndex, hymnNumber, hymnData, searchHymn, fileUrl } = useHymn()

const { onTimeUpdate, onEnded, player: playerElement, ...player } = usePlayer()

onMounted(() => {
  onTimeUpdate(() => handleMusicTimestamp())
  onEnded(() => toHomeScene())
})

watch(hymnIndex, async (index) => {
  if (index === 0) {
    return
  }
  await showVerse(index - 1)
  if (!store.onSearchSwitchToHymnScene) {
    return
  }
  if (!store.onSearchHymnScene) {
    return
  }
  await setCurrentScene(store.onSearchHymnScene)
})

async function search(number: number | string) {
  await searchHymn(number)
  player.load()
  if (connected.value) {
    goTitle()
  }
  if (store.autoplayMusic) {
    player.play()
  }
}

function handleMusicTimestamp() {
  if (!connected.value) {
    return
  }
  if (!store.autodriveVerses) {
    return
  }
  const nextSequence = hymnData.value?.sequence
    .filter((v) => v.timestamp && v.timestamp - 0.5 < player.currentTime.value)
    .reverse()[0]
  if (!nextSequence) {
    return
  }
  if (!hymnData.value) {
    return
  }
  const position = hymnData.value.sequence.indexOf(nextSequence) + 1
  if (nextSequence && position !== hymnIndex.value) {
    hymnIndex.value = position
  }
}

async function goTitle() {
  hymnIndex.value = 0
  await showTitle()
  if (!store.onSearchSwitchToHymnScene) {
    return
  }
  if (!store.onSearchHymnScene) {
    return
  }
  await setCurrentScene(store.onSearchHymnScene)
}

async function toHomeScene(fadeoutMusic = false) {
  if (fadeoutMusic) {
    await player.stop()
  }
  if (!connected.value) {
    return
  }
  if (store.onMusicEndSwitchToScene) {
    await setCurrentScene(store.onMusicEndSwitchToScene)
  }
}

async function showTitle() {
  await setSourceVisibility('himno_numero', true)
  await setSourceVisibility('himno_titulo', true)
  await setSourceVisibility('verso_numero', false)
  await setSourceVisibility('verso_contenido', false)
  await setSourceText('himno_numero', hymnData.value?.number.toString())
  await setSourceText('himno_titulo', hymnData.value?.title)
}

async function showVerse(index: number) {
  if (!hymnData.value) {
    return
  }
  const sequence = hymnData.value.sequence[index]
  const verse = hymnData.value?.verses.find((v) => v.id === sequence.verseId)
  const content = verse?.contents.find((c) => c.id === sequence.verseContentId)
  const verseNumber = verse?.number === 0 ? 'Coro' : String(verse?.number)
  await setSourceVisibility('himno_numero', false)
  await setSourceVisibility('himno_titulo', false)
  await setSourceVisibility('verso_numero', true)
  await setSourceVisibility('verso_contenido', true)
  await setSourceText('verso_numero', verseNumber)
  await setSourceText('verso_contenido', content?.content)
}
</script>

<template>
  <main class="flex flex-col gap-4 px-3 py-2 text-xs">
    <div class="flex gap-2">
      <BaseButton
        :title="connected? 'Desconectar' : 'Conectar'"
        class="flex items-center gap-3 w-32 h-7"
        @click="connected? disconnect() : connect()"
      >
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green-600' : 'bg-red-600'"></div>
        {{ connected? 'Conectado' : 'Desconectado' }}
      </BaseButton>
      <div class="ml-auto flex gap-2">
        <SetupScene />
        <AutodriveButton />
        <SettingsPanel />
        <AboutApp />
      </div>
    </div>
    <form class="flex gap-2" onsubmit="return false">
      <InputText
        v-model="hymnNumber"
        id="number"
        name="number"
        type="number"
        min="1"
        max="613"
        class="w-16"
        title="Número del himno"
      />
      <BaseButton
        class="w-8 h-8"
        title="Buscar"
        type="submit"
        @click="search(hymnNumber)"
      >
        <SearchIcon />
      </BaseButton>
      <HymnSearcher @on-play-hymn="search($event)" />
      <BaseButton
        :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 1"
        class="w-8 h-8 ms-auto"
        title="Principio"
        @click="goTitle()"
      >
        <HomeIcon />
      </BaseButton>
      <BaseButton
        :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 2"
        class="w-8 h-8"
        title="Verso anterior"
        @click="hymnIndex--"
      >
        <PreviousIcon />
      </BaseButton>
      <BaseButton
        :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || (hymnData? hymnIndex >= hymnData.sequence.length : true)"
        class="w-8 h-8"
        title="Verso siguiente"
        @click="hymnIndex++"
      >
        <NextIcon />
      </BaseButton>
      <BaseButton
        :disabled="!connected"
        class="w-8 h-8"
        title="Detener"
        @click="toHomeScene(true)"
      >
        <StopIcon />
      </BaseButton>
    </form>
    <div class="space-y-2">
      <p data-test="hymn-title">
        Reproduciendo: <span class="text-[#9E9E9E]">{{ hymnData?.title }}</span>
      </p>
      <audio ref="playerElement" controls class="dark:audio-dark">
        <source :src="hymnData && fileUrl()" type="audio/mpeg">
        Tu navegador no soporta el elemento <code>audio</code>.
      </audio>
    </div>
  </main>
</template>
