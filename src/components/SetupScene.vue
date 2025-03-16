<script setup lang="ts">
import type { OBSEventTypes } from 'obs-websocket-js'
import { ref, watch } from 'vue'
import { useObs } from '../composables/obs'
import { sceneStatus, store } from '../store'
import BasicDialog from './BasicDialog.vue'
import BaseButton from './commons/BaseButton.vue'

const { on, connected, getSceneItems, createScene, createSource } = useObs()

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)

watch(connected, async (connected) => {
  if (!connected) {
    return
  }
  if (sceneStatus.scene && Object.values(sceneStatus.source).every((v) => v)) {
    return
  }
  dialog.value?.open()
})

on('SceneListChanged', checkScene)
on('SceneItemCreated', checkSource)
on('SceneItemRemoved', checkSource)

function checkScene({ scenes }: OBSEventTypes['SceneListChanged']) {
  sceneStatus.scene = scenes.some(
    (scene) => scene.sceneName === store.onSearchHymnScene,
  )
}

async function checkSource({
  sceneName,
  sourceName,
}: OBSEventTypes['SceneItemCreated' | 'SceneItemRemoved']) {
  if (sceneName !== store.onSearchHymnScene) {
    return
  }
  let source: keyof typeof sceneStatus.source
  if (sourceName === 'verso_contenido') {
    source = 'versoContenido'
  } else if (sourceName === 'verso_numero') {
    source = 'versoNumero'
  } else if (sourceName === 'himno_titulo') {
    source = 'himnoTitulo'
  } else if (sourceName === 'himno_numero') {
    source = 'himnoNumero'
  } else {
    return
  }
  await getSceneItems(store.onSearchHymnScene)
  const sceneItem = store.sourceList.find(
    (source) => source.sourceName === sourceName,
  )
  sceneStatus.source[source] = Boolean(
    sceneItem && sceneItem.inputKind === 'text_gdiplus_v2',
  )
}

async function createSceneAndSources() {
  !sceneStatus.scene && (await createScene())
  !sceneStatus.source.versoContenido && (await createSource('verso_contenido'))
  !sceneStatus.source.versoNumero && (await createSource('verso_numero'))
  !sceneStatus.source.himnoTitulo && (await createSource('himno_titulo'))
  !sceneStatus.source.himnoNumero && (await createSource('himno_numero'))
}
</script>

<template>
  <BasicDialog ref="dialog" title="" data-test="settings">
    <template v-slot:header>
      <div class="flex items-center gap-2">
        <div class="rounded-full w-2 h-2" :class="sceneStatus.scene? 'bg-green-600' : 'bg-red-600'"></div>
        {{ store.onSearchHymnScene }}
      </div>
    </template>
    <div class="space-y-1">
      <div class="bg-[#F3F3F3] dark:bg-[#3C404B] w-full flex items-stretch rounded-sm divide-x divide-[#E5E5E5] dark:divide-[#2B2E38]">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himnoNumero? 'bg-green-600' : 'bg-red-600'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          himno_numero
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-[#F3F3F3] dark:bg-[#3C404B] w-full flex items-stretch rounded-sm divide-x divide-[#E5E5E5] dark:divide-[#2B2E38]">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himnoTitulo? 'bg-green-600' : 'bg-red-600'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          himno_titulo
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-[#F3F3F3] dark:bg-[#3C404B] w-full flex items-stretch rounded-sm divide-x divide-[#E5E5E5] dark:divide-[#2B2E38]">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.versoNumero? 'bg-green-600' : 'bg-red-600'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          verso_numero
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-[#F3F3F3] dark:bg-[#3C404B] w-full flex items-stretch rounded-sm divide-x divide-[#E5E5E5] dark:divide-[#2B2E38]">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.versoContenido? 'bg-green-600' : 'bg-red-600'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          verso_contenido
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <p v-if="!sceneStatus.scene || Object.values(sceneStatus.source).some(v => !v)" class="pt-1 pb-2">⚠️ Se encontraron recursos faltantes</p>
      <p v-else class="pt-1">✅ Todos los recursos están listos</p>
    </div>
    <template v-slot:footer>
      <BaseButton
        v-if="!sceneStatus.scene || Object.values(sceneStatus.source).some(v => !v)"
        class="ml-auto"
        @click="createSceneAndSources()"
      >
        Crear recursos
      </BaseButton>
    </template>
  </BasicDialog>
</template>
