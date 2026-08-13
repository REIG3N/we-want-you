<script setup lang="ts">
import type { Annonce } from "../types/annonce"
import EnchereForm from "./EnchereForm.vue"

defineProps<{ annonce: Annonce }>()
const emit = defineEmits(["miseAJour", "retour"])
</script>

<template>
  <div>
    <button @click="emit('retour')">← Retour</button>

    <h2>{{ annonce.titre }}</h2>
    <p>{{ annonce.description }}</p>
    <p>Statut : {{ annonce.statut === "terminee" ? "Terminée" : "En cours" }}</p>
    <p>Fin : {{ new Date(annonce.dateFin).toLocaleString("fr-FR") }}</p>
    <p>Prix de départ : {{ annonce.prixDepart }} €</p>
    <p>Pas d'enchère : {{ annonce.pasEnchere }} €</p>
    <p>Meilleure enchère : {{ annonce.meilleureEnchere }} €</p>

    <h3>Enchérir</h3>
    <EnchereForm :annonce="annonce" @succes="emit('miseAJour', $event)" />

    <h3>Historique ({{ annonce.encheres.length }})</h3>
    <p v-if="annonce.encheres.length === 0">Aucune enchère pour le moment.</p>
    <ul v-else>
      <li v-for="(enchere, i) in annonce.encheres" :key="i">
        {{ enchere.pseudo }} — {{ enchere.montant }} €
        — {{ new Date(enchere.date).toLocaleString("fr-FR") }}
      </li>
    </ul>
  </div>
</template>