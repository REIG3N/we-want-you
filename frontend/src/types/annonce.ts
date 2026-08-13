export interface Enchere {
  pseudo: string
  montant: number
  date: string
}

export interface Annonce {
  id: string
  titre: string
  description: string
  prixDepart: number
  pasEnchere: number
  dateFin: string
  // statut et meilleureEnchere sont calculés par le serveur, pas stockés dans le JSON
  statut: "en_cours" | "terminee"
  meilleureEnchere: number
  encheres: Enchere[]
}