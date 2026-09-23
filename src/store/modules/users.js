export default{
    namespaced: true,
    state: {
        utilisateurs: [],
        utilisateurCourant: null
    },

    mutations:{
        ajouterUtilisateur(state, {nom, motDePasse}){
            state.utilisateurs.push({nom, motDePasse, pokeballs: 0, role: 'joueur'});
        },

        definirUtilisateurCourant(state, nom){
            state.utilisateurCourant = nom;
        },

        sauvegarerScore(state, {nom, pokeballs}){
            const utilisateur = state.utilisateurs.find(utilisateur => utilisateur.nom === nom);
            if(utilisateur){
                utilisateur.pokeballs = pokeballs;
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
                utilisateur.pokeballs = 0;
            });
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
            return [...state.utilisateurs].sort((a, b) => b.pokeballs - a.pokeballs);
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
                commit('definirUtilisateurCourant', nom);
                dispatch('pokeballs/chargerPokeballs', utilisateur.pokeballs, {root: true});
                return {success: true, message: 'Connexion réussie'};
            }
            return {success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect'};
        },

        deconnecter({commit, dispatch, rootState}){
            dispatch('sauvegarderPartie');
            commit('definirUtilisateurCourant', null);
        },

        sauvegarderPartie({commit, state, rootState, dispatch}){
            if(!state.utilisateurCourant) return;
            commit('sauvegarerScore', {nom: state.utilisateurCourant, pokeballs: rootState.pokeballs.pokeballs});
            dispatch('persister');
        },

        modifierScoreJoueur({commit,  getters}, {nom, nouveauScore}){
            if(getters.estAdmin){
                commit('sauvegarerScore', {nom, pokeballs: nouveauScore});
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

        persister({state}){
            localStorage.setItem('pokeball-clicker-utilisateurs', JSON.stringify(state.utilisateurs));
        }
    }
}