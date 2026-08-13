<script setup lang="ts">
import { ref } from "vue"
import type { Annonce } from "../types/annonce"
import { posterEnchere } from "../api/annonces"

const props = defineProps<{ annonce: Annonce }>()
const emit = defineEmits(["succes"])

// ref = useState. Dans le script on écrit .value, dans le template non.
const pseudo = ref("")
const montant = ref("")
const erreur = ref("")

async function soumettre() {
  erreur.value = ""
  try {
    // Aucune validation métier ici : l'état affiché peut être obsolète
    // (un autre utilisateur a pu enchérir entre-temps). Le backend tranche.
    const maj = await posterEnchere(props.annonce.id, pseudo.value, Number(montant.value))
    emit("succes", maj)
    montant.value = ""
  } catch (e) {
    erreur.value = (e as Error).message
  }
}
</script>

<template>
  <p v-if="annonce.statut === 'terminee'">
    Cette annonce est terminée, les enchères sont closes.
  </p>

  <form v-else @submit.prevent="soumettre">
    <input v-model="pseudo" placeholder="Pseudo" />
    <input v-model="montant" type="number" placeholder="Montant en €" />
    <button type="submit">Enchérir</button>
  </form>

  <p v-if="erreur" role="alert">{{ erreur }}</p>
</template>