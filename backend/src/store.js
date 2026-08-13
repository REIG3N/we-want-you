import annonceData from "../../data/annonces.json" with { type: "json" };

export const ECHEC = {
    ANNONCE_INTROUVABLE: "ANNONCE_INTROUVABLE",           // RM1
    DONNEES_INVALIDES: "DONNEES_INVALIDES",               // RM5
    ANNONCE_TERMINEE: "ANNONCE_TERMINEE",                 // RM2
    MONTANT_TROP_BAS: "MONTANT_TROP_BAS",                 // RM3
    PAS_ENCHERE_NON_RESPECTE: "PAS_ENCHERE_NON_RESPECTE", // RM4
}

export function creerStore(annoncesInitiales, maintenant = () => new Date()) {
    // Copie de travail en RAM. Le JSON importé n'est jamais muté ;
    // les enchères ajoutées disparaissent au redémarrage du processus.
    const annonces = structuredClone(annoncesInitiales)

    function meilleureEnchere(annonce) {
        if (annonce.encheres.length === 0) return annonce.prixDepart
        return Math.max(...annonce.encheres.map(e => e.montant))
    }

    function estTerminee(annonce) {
        return new Date(annonce.dateFin) <= maintenant()
    }

    /** Forme exposée par l'API : statut et meilleure enchère sont calculés, pas stockés. */
    function enReponse(annonce) {
        return {
            ...annonce,
            statut: estTerminee(annonce) ? "terminee" : "en_cours",
            meilleureEnchere: meilleureEnchere(annonce),
            encheres: [...annonce.encheres].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            ),
        }
    }

    function toutesLesAnnonces() {
        return annonces.map(enReponse)
    }

    function annonceParId(id) {
        return annonces.find(a => a.id === id) ?? null
    }

    function refus(echec, message) {
        return { succes: false, echec, message, annonce: null }
    }

    function ajouterEnchere(annonceId, pseudo, montant) {
        // RM1 — annonce inexistante
        const annonce = annonceParId(annonceId)
        if (!annonce) {
            return refus(
                ECHEC.ANNONCE_INTROUVABLE,
                `Aucune annonce ne correspond à l'identifiant ${annonceId}.`
            )
        }

        // RM5 — validation de format, avant toute comparaison.
        // Indispensable en JS : une comparaison avec undefined ou une chaîne
        // produit NaN, et toute comparaison avec NaN est fausse — RM3 et RM4
        // laisseraient donc passer ces valeurs.
        if (typeof pseudo !== "string" || pseudo.trim() === "") {
            return refus(ECHEC.DONNEES_INVALIDES, "Le pseudo est obligatoire.")
        }
        if (typeof montant !== "number" || !Number.isFinite(montant) || montant <= 0) {
            return refus(
                ECHEC.DONNEES_INVALIDES,
                "Le montant doit être un nombre strictement positif."
            )
        }

        // RM2 — annonce terminée
        if (estTerminee(annonce)) {
            return refus(
                ECHEC.ANNONCE_TERMINEE,
                "Cette annonce est terminée, elle n'accepte plus d'enchère."
            )
        }

        const meilleure = meilleureEnchere(annonce)

        // RM3 — montant <= meilleure enchère actuelle.
        // Testé AVANT RM4 : le seuil de RM4 est plus haut, il absorberait ce cas
        // et le 409 deviendrait inatteignable.
        if (montant <= meilleure) {
            return refus(
                ECHEC.MONTANT_TROP_BAS,
                `Le montant doit dépasser la meilleure enchère actuelle (${meilleure} €).`
            )
        }

        // RM4 — incrément inférieur au pas d'enchère
        const minimum = meilleure + annonce.pasEnchere
        if (montant < minimum) {
            return refus(
                ECHEC.PAS_ENCHERE_NON_RESPECTE,
                `Le montant doit atteindre au moins ${minimum} € (pas d'enchère de ${annonce.pasEnchere} €).`
            )
        }

        // La date est générée par le serveur, jamais reçue du client :
        // sinon n'importe qui pourrait antidater son enchère.
        annonce.encheres.push({
            pseudo: pseudo.trim(),
            montant,
            date: maintenant().toISOString(),
        })

        return { succes: true, echec: null, message: null, annonce }
    }

    // Le tableau `annonces` n'est pas exposé : il n'est atteignable
    // que par ces fonctions (closure).
    return { toutesLesAnnonces, annonceParId, enReponse, estTerminee, ajouterEnchere }
}

/** Instance utilisée par le serveur. Les tests créent la leur avec creerStore(). */
export const store = creerStore(annonceData)