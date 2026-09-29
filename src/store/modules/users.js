export default{
    namespaced: true,
    state: {
        utilisateurs: [],
        utilisateurCourant: null
    },

    mutations:{
        ajouterUtilisateur(state, {nom, motDePasse}){
            state.utilisateurs.push({nom, motDePasse, role: 'joueur', partie:{
                pokeballs: 0,
                totalPokeballs: 0,
                parClick: 1,
                multiplicateurGlobal: 1,
                passif:{}
            }});
        },

        definirUtilisateurCourant(state, nom){
            state.utilisateurCourant = nom;
        },

        sauvegarerScore(state, {nom, partie}){
            const utilisateur = state.utilisateurs.find(utilisateur => utilisateur.nom === nom);
            if(utilisateur){
                utilisateur.partie = partie;
            }
        },

        chargerUtillisateurs(state, utilisateurs){
            state.utilisateurs = utilisateurs;
        },

        definirRole(state, {nom, role}){
            const utilisateur = state.utilisateurs.find(utilisateur => utilisateur.nom === nom);
            if(utilisateur){
                utilisateur.role = role;
            }
        },

        reinitialiserScores(state){
            state.utilisateurs.forEach(utilisateur => {
                utilisateur.partie = {
                    pokeballs: 0,
                    totalPokeballs: 0,
                    parClick: 1,
                    multiplicateurGlobal: 1,
                    passif:{}
                };
            });
        },

        suppressionUtilisateur(state, nom){
            state.utilisateurs = state.utilisateurs.filter(utilisateur => utilisateur.nom !== nom);
        }
    },

    getters:{
        estConnecte: state => {
            return state.utilisateurCourant !== null;
        },

        utilisateurActuel: state => {
            return state.utilisateurs.find(utilisateur => utilisateur.nom === state.utilisateurCourant) || null;
        },

        nomExiste: state => nom => {
            return state.utilisateurs.some(utilisateur => utilisateur.nom === nom);
        },

        estAdmin: (state, getters) => {
            const utilisateur = getters.utilisateurActuel;
            return utilisateur ? utilisateur.role === 'admin' : false;
        },

        classement: state => {
            return [...state.utilisateurs].sort((a, b) => b.partie.totalPokeballs || 0 - a.partie.totalPokeballs || 0);
        },

        rangUtilisateur: (state, gatters) => nom => {
            const classement = gatters.classement;
            const index = classement.findIndex(utilisateur => utilisateur.nom === nom);
            return index !== -1 ? index + 1 : null;
        }
    },

    actions:{
        initialiser({commit, state}){
            const donne = localStorage.getItem('pokeball-clicker-utilisateurs');
            if(donne){
                commit('chargerUtillisateurs', JSON.parse(donne));
            }

            if(!state.utilisateurs.some(utilisateur => utilisateur.nom === 'admin')){
                commit('ajouterUtilisateur', {nom: 'admin', motDePasse: 'admin'});
                commit('definirRole', {nom: 'admin', role: 'admin'});
            }
        },

        inscrire({commit, getters, dispatch}, {nom, motDePasse}){
            if(getters.nomExiste(nom)){
                return {success: false, message: 'Nom d\'utilisateur déjà utilisé'};
            }
            commit('ajouterUtilisateur', {nom, motDePasse});
            dispatch('persister');
            return {success: true, message: 'Inscription réussie'};
        },

        connecter({commit, state, dispatch}, {nom, motDePasse}){
            const utilisateur = state.utilisateurs.find(u => u.nom === nom && u.motDePasse === motDePasse);
            if(utilisateur){
                commit('definirUtilisateurCourant', nom)
                dispatch('pokeballs/fusionnerEtCharger', utilisateur.partie, {root: true});
                dispatch('pokeballs/effacerInvite', null, {root: true});
                return {success: true, message: 'Connexion réussie'};
            }
            return {success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect'};
        },

        deconnecter({commit, dispatch, rootState}){
            dispatch('sauvegarderPartie');
            commit('definirUtilisateurCourant', null);
            dispatch('pokeballs/reinitialiserEtat', null, {root: true});
        },

        sauvegarderPartie({commit, state, rootGetters, dispatch}){
            if(!state.utilisateurCourant) return;
            const etat=rootGetters['pokeballs/etatSauvegardable'];
            commit('sauvegarerScore', {nom: state.utilisateurCourant, partie: etat});
            dispatch('persister');
        },

        modifierScoreJoueur({commit,  getters, dispatch, state}, {nom, nouveauScore}){
            if(getters.estAdmin){
                const utilisateur = state.utilisateurs.find(utilisateur => utilisateur.nom === nom);
                if(utilisateur){
                    user.partie.totalPokeballs = nouveauScore;
                    user.partie.pokeballs = nouveauScore;
                }
                dispatch('persister');
                return {success: true, message: 'Score modifié avec succès'};
            }
            return {success: false, message: 'Permission refusée'};
        },

        reinitialiserScores({commit, getters, dispatch}){
            if(getters.estAdmin){
                commit('reinitialiserScores');
                dispatch('persister');
                return {success: true, message: 'Scores réinitialisés avec succès'};
            }
            return {success: false, message: 'Permission refusée'};
        },

        promouvoirAdmin({commit, getters}, nom){
            if(getters.estAdmin){
                commit('definirRole', {nom, role: 'admin'});
                return {success: true, message: 'Utilisateur promu en admin avec succès'};
            }
            return {success: false, message: 'Permission refusée'};
        },

        supprimerUtilisateur({commit, getters, dispatch, state}, nom){
            if(getters.estAdmin){
                if(state.utilisateurCourant === nom){
                    return {success: false, message: 'Vous ne pouvez pas supprimer votre propre compte'};
                }
                commit('suppressionUtilisateur', nom);
                dispatch('persister');
                return {success: true, message: 'Utilisateur supprimé avec succès'};
            }
            return {success: false, message: 'Permission refusée'};
        },

        persister({state}){
            localStorage.setItem('pokeball-clicker-utilisateurs', JSON.stringify(state.utilisateurs));
        }
    }
}