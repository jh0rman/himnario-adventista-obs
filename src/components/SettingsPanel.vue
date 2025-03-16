<script setup lang="ts">
import { ref, watch } from 'vue'
import { useObs } from '../composables/obs'
import { defaultValues, store } from '../store'
import BasicDialog from './BasicDialog.vue'
import GearIcon from './icons/GearIcon.vue'
import InputSelect from './commons/InputSelect.vue'
import InputText from './commons/InputText.vue'
import BaseButton from './commons/BaseButton.vue'

const { reconnect } = useObs()

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)
const darkMode = ref<'light' | 'dark'>(
  (() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      return 'dark'
    }
    document.documentElement.classList.remove('dark')
    return 'light'
  })(),
)

watch(darkMode, (value) => {
  localStorage.theme = value
  if (value === 'light') {
    document.documentElement.classList.remove('dark')
  }
  if (value === 'dark') {
    document.documentElement.classList.add('dark')
  }
})

async function closeDialog() {
  localStorage.setItem('onlyInstrumental', `${store.onlyInstrumental}`)
  localStorage.setItem('autoplayMusic', `${store.autoplayMusic}`)
  localStorage.setItem('autodriveVerses', `${store.autodriveVerses}`)
  localStorage.setItem(
    'onSearchSwitchToHymnScene',
    `${store.onSearchSwitchToHymnScene}`,
  )
  localStorage.setItem('onSearchHymnScene', `${store.onSearchHymnScene}`)
  localStorage.setItem('onMusicEndSwitchToScene', store.onMusicEndSwitchToScene)
  localStorage.setItem('obsWebsocketUrl', store.obsWebsocketUrl)
  localStorage.setItem('musicHostUrl', store.musicHostUrl)
  localStorage.setItem('hymnalApiUrl', store.hymnalApiUrl)
  await reconnect()
  dialog.value?.close()
}
</script>

<template>
  <BaseButton
    class="w-7 h-7 ml-auto"
    title="Configuración"
    @click="dialog?.open"
  >
    <GearIcon />
  </BaseButton>
  <BasicDialog ref="dialog" title="Configuración" data-test="settings">
    <div class="text-sm">
      <div class="mb-2">
        <h3 class="font-bold">Al buscar:</h3>
        <div class="flex items-center gap-1">
          <label for="oi">Solo instrumental</label>
          <input v-model="store.onlyInstrumental" type="checkbox" id="oi" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="am">Autoreproducir música</label>
          <input v-model="store.autoplayMusic" type="checkbox" id="am" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="av">Autoconducir versos</label>
          <input v-model="store.autodriveVerses" type="checkbox" id="av" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="sch">Cambiar a escena de himno</label>
          <input v-model="store.onSearchSwitchToHymnScene" type="checkbox" id="sch" class="ml-auto">
        </div>
        <div class="flex flex-col">
          <label for="hs">Escena de himno</label>
          <InputSelect v-model="store.onSearchHymnScene" id="hs">
            <option value="">ninguno</option>
            <option class="hidden" :value="store.onSearchHymnScene">{{ store.onSearchHymnScene }}</option>
            <option v-for="(scene, index) in store.sceneList" :key="index" :value="scene.sceneName">{{ scene.sceneName }}</option>
          </InputSelect>
        </div>
      </div>
      <div class="mb-2">
        <h3 class="font-bold">Al terminar la música:</h3>
        <div class="flex flex-col">
          <label for="sc">Cambiar a escena</label>
          <InputSelect v-model="store.onMusicEndSwitchToScene" id="sc">
            <option value="">ninguno</option>
            <option class="hidden" :value="store.onMusicEndSwitchToScene">{{ store.onMusicEndSwitchToScene }}</option>
            <option v-for="(scene, index) in store.sceneList" :key="index" :value="scene.sceneName">{{ scene.sceneName }}</option>
          </InputSelect>
        </div>  
      </div>
      <div class="mb-2">
        <h3 class="font-bold">Red:</h3>
        <div class="flex flex-col">
          <label for="ow">URL de OBS Websocket</label>
          <InputText v-model="store.obsWebsocketUrl" id="ow" :placeholder="defaultValues.obsWebsocketUrl" />
        </div>
        <div class="flex flex-col">
          <label for="mh">URL de host de música</label>
          <InputText v-model="store.musicHostUrl" id="mh" :placeholder="defaultValues.musicHostUrl ?? 'default'" />
        </div>
        <div class="flex flex-col">
          <label for="ha">URL de API de himnario</label>
          <InputText v-model="store.hymnalApiUrl" id="ha" :placeholder="defaultValues.hymnalApiUrl" />
        </div>
      </div>
      <div class="mb-3">
        <h3 class="font-bold">Personalización:</h3>
        <div class="flex flex-col">
          <label for="tm">Tema</label>
          <InputSelect v-model="darkMode" id="tm">
            <option value="light">claro</option>
            <option value="dark">oscuro</option>
          </InputSelect>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <BaseButton
        class="ml-auto"
        title="Guardar y cerrar"
        @click="closeDialog"
      >
        Guardar y cerrar
      </BaseButton>
    </template>
  </BasicDialog>
</template>
