import type { Annonce } from "../types/annonce"

const API = "http://localhost:3333/api"

export async function getAnnonces(): Promise<Annonce[]> {
  const reponse = await fetch(`${API}/annonces`)
  if (!reponse.ok) throw new Error("Impossible de charger les annonces.")
  return reponse.json()
}

export async function posterEnchere(
  id: string,
  pseudo: string,
  montant: number
): Promise<Annonce> {
  const reponse = await fetch(`${API}/annonces/${id}/encheres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, montant }),
  })

  const data = await reponse.json()

  // Le message affiché vient de l'API, jamais d'un calcul local :
  // seul le backend connaît l'état à jour au moment de la requête.
  if (!reponse.ok) throw new Error(data.message)

  return data
}