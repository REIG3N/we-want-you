<script setup lang="ts">
import type { Annonce } from "../types/annonce"

defineProps<{ annonces: Annonce[] }>()
const emit = defineEmits(["selection"])
</script>

<template>
  <ul>
    <li v-for="annonce in annonces" :key="annonce.id">
      {{ annonce.titre }} — {{ annonce.meilleureEnchere }} € —
      {{ annonce.statut === "terminee" ? "Terminée" : "En cours" }}
      <button @click="emit('selection', annonce.id)">Voir</button>
    </li>
  </ul>
</template>