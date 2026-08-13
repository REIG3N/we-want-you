import express from 'express';
import cors from 'cors';
import { store, ECHEC } from './store.js';

const app = express()

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}))
app.use(express.json())

const CODES_HTTP = {
    [ECHEC.ANNONCE_INTROUVABLE]: 404,
    [ECHEC.DONNEES_INVALIDES]: 400,
    [ECHEC.ANNONCE_TERMINEE]: 410,
    [ECHEC.MONTANT_TROP_BAS]: 409,
    [ECHEC.PAS_ENCHERE_NON_RESPECTE]: 422,
}

app.get('/api/annonces', (req, res) => {
    res.json(store.toutesLesAnnonces())
})

app.get('/api/annonces/:id', (req, res) => {
    const annonce = store.annonceParId(req.params.id)

    if (!annonce) {
        return res.status(404).json({
            code: ECHEC.ANNONCE_INTROUVABLE,
            message: `Aucune annonce ne correspond à l'identifiant ${req.params.id}.`
        })
    }

    res.json(store.enReponse(annonce))
})

app.post('/api/annonces/:id/encheres', (req, res) => {
    const { pseudo, montant } = req.body ?? {}

    const resultat = store.ajouterEnchere(req.params.id, pseudo, montant)

    if (resultat.succes) {
        return res.status(201).json(store.enReponse(resultat.annonce))
    }

    res.status(CODES_HTTP[resultat.echec]).json({
        code: resultat.echec,
        message: resultat.message,
    })
})

app.listen(3333, () => {
    console.log('API disponible sur http://localhost:3333/api/annonces')
})