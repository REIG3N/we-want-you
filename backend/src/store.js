import annonceData from "../../data/annonces.json" with { type: "json" };

export const ECHEC = {
    ANNONCE_INTROUVABLE: "ANNONCE_INTROUVABLE",           // RM1
    DONNEES_INVALIDES: "DONNEES_INVALIDES",               // RM5
    ANNONCE_TERMINEE: "ANNONCE_TERMINEE",                 // RM2
    MONTANT_TROP_BAS: "MONTANT_TROP_BAS",                 // RM3
    PAS_ENCHERE_NON_RESPECTE: "PAS_ENCHERE_NON_RESPECTE", // RM4
}

export function creerStore(annoncesInitiales, maintenant = () => new Date()) {
    const annonces = structuredClone(annoncesInitiales)

    function meilleureEnchere(annonce) {
        if (annonce.encheres.length === 0) return annonce.prixDepart
        return Math.max(...annonce.encheres.map(e => e.montant))
    }

    function estTerminee(annonce) {
        return new Date(annonce.dateFin) <= maintenant()
    }

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
        // RM1: annonce inexistante
        const annonce = annonceParId(annonceId)
        if (!annonce) {
            return refus(
                ECHEC.ANNONCE_INTROUVABLE,
                `Aucune annonce ne correspond à l'identifiant ${annonceId}.`
            )
        }

        // RM5: validation de format, avant toute comparaison.
        if (typeof pseudo !== "string" || pseudo.trim() === "") {
            return refus(ECHEC.DONNEES_INVALIDES, "Le pseudo est obligatoire.")
        }
        if (typeof montant !== "number" || !Number.isFinite(montant) || montant <= 0) {
            return refus(
                ECHEC.DONNEES_INVALIDES,
                "Le montant doit être un nombre strictement positif."
            )
        }

        // RM2: annonce terminée
        if (estTerminee(annonce)) {
            return refus(
                ECHEC.ANNONCE_TERMINEE,
                "Cette annonce est terminée, elle n'accepte plus d'enchère."
            )
        }

        const meilleure = meilleureEnchere(annonce)

        // RM3: montant <= meilleure enchère actuelle.
        if (montant <= meilleure) {
            return refus(
                ECHEC.MONTANT_TROP_BAS,
                `Le montant doit dépasser la meilleure enchère actuelle (${meilleure} €).`
            )
        }

        // RM4: incrément inférieur au pas d'enchère
        const minimum = meilleure + annonce.pasEnchere
        if (montant < minimum) {
            return refus(
                ECHEC.PAS_ENCHERE_NON_RESPECTE,
                `Le montant doit atteindre au moins ${minimum} € (pas d'enchère de ${annonce.pasEnchere} €).`
            )
        }

        annonce.encheres.push({
            pseudo: pseudo.trim(),
            montant,
            date: maintenant().toISOString(),
        })

        return { succes: true, echec: null, message: null, annonce }
    }

    return { toutesLesAnnonces, annonceParId, enReponse, estTerminee, ajouterEnchere }
}

export const store = creerStore(annonceData)