<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Annonce } from "./types/annonce"
import { getAnnonces } from "./api/annonces"
import AnnoncesList from "./components/AnnoncesList.vue"
import AnnonceDetail from "./components/AnnonceDetail.vue"

const annonces = ref<Annonce[]>([])
const selection = ref<Annonce | null>(null)
const erreur = ref("")

// onMounted = useEffect(fn, [])
onMounted(async () => {
  try {
    annonces.value = await getAnnonces()
  } catch (e) {
    erreur.value = (e as Error).message
  }
})

function ouvrir(id: string) {
  selection.value = annonces.value.find((a) => a.id === id) ?? null
}

// L'API renvoie l'annonce à jour après une enchère acceptée :
// on remplace celle affichée et celle de la liste, sans second GET.
function appliquerMiseAJour(maj: Annonce) {
  selection.value = maj
  annonces.value = annonces.value.map((a) => (a.id === maj.id ? maj : a))
}
</script>

<template>
  <main>
    <h1>Enchères</h1>

    <p v-if="erreur" role="alert">{{ erreur }}</p>

    <AnnonceDetail
      v-else-if="selection"
      :annonce="selection"
      @mise-a-jour="appliquerMiseAJour"
      @retour="selection = null"
    />

    <AnnoncesList v-else :annonces="annonces" @selection="ouvrir" />
  </main>
</template>