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

        sauvegarerScore(state, {nom, score}){
            const utilisateur = state.utilisateurs.find(utilisateur => utilisateur.nom === nom);
            if(utilisateur){
                utilisateur.pokeballs = score;
            }
        },

        chargerUtillisateurs(state, utilisateurs){
            state.utilisateurs = utilisateurs;
        }
    },

    getters:{
        estConnecte: state => {
            return state.utilisateurCourant !== null;
        },

        utilisateurCourant: state => {
            return state.utilisateurs.find(utilisateur => utilisateur.nom === state.utilisateurCourant) || null;
        },

        nomExiste: state => nom => {
            return state.utilisateurs.some(utilisateur => utilisateur.nom === nom);
        }
    },

    actions:{
        initialiser({commit}){
            const donne = localStorage.getItem('pokeball-clicker-utilisateurs');
            if(donne){
                commit('chargerUtillisateurs', JSON.parse(donne));
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

        persister({state}){
            localStorage.setItem('pokeball-clicker-utilisateurs', JSON.stringify(state.utilisateurs));
        }
    }
}