export default {
    namespaced: true,
    state: {
        pokeballs: 0,
        totalPokeballs: 0,
        parClick: 1,
        multiplicateurGlobal: 1,
        passif:{
            ramoloss:{
            niveau: 0,
            coutBase: 15,
            productionParSeconde: 0.1
        },
        ponchiot:{
            niveau: 0,
            coutBase: 100,
            productionParSeconde: 1
        },
        centrePokemon:{
            niveau: 0,
            coutBase: 1100,
            productionParSeconde: 8
        },
        boutiquePokemon:{
            niveau: 0,
            coutBase: 12000,
            productionParSeconde: 47
        },
        professeurPokemon:{
            niveau: 0,
            coutBase: 130000,
            productionParSeconde: 260
        }
    },
  },
  mutations:{
    ajouterPokeball(state, quantite=1){
        state.pokeballs += quantite * state.multiplicateurGlobal
        state.totalPokeballs += quantite * state.multiplicateurGlobal
    },

    cliquer(state){
        state.pokeballs += state.parClick * state.multiplicateurGlobal
        state.totalPokeballs += state.parClick * state.multiplicateurGlobal
    },

    ajouterPokeballBrut(state, quantite){
        state.pokeballs += quantite
        state.totalPokeballs += quantite
    },

    acheterPassif(state, {nom, cout}){
        state.pokeballs -= cout
        state.passif[nom].niveau++
    },

    definirMultiplicateur(state, valeur){
        state.multiplicateurGlobal = valeur
    },

    chargerEtat(state, donnees){
        state.pokeballs = donnees.pokeballs || 0;
        state.totalPokeballs = donnees.totalPokeballs || 0;
        state.parClick = donnees.parClick || 1;
        state.multiplicateurGlobal = donnees.multiplicateurGlobal || 1;
        
        if (donnees.passif) {
            for (const nom in donnees.passif) {
                if (state.passif[nom]) {
                    state.passif[nom].niveau = donnees.passif[nom].niveau || 0;
                }
            }
        }
    },

    reinitialiserEtat(state){
        state.pokeballs = 0;
        state.totalPokeballs = 0;
        state.parClick = 1;
        state.multiplicateurGlobal = 1;
        for (const nom in state.passif) {
            state.passif[nom].niveau = 0;
        }
    },

    fusionnerEtat(state, donnesCompte){
        state.pokeballs += donnesCompte.pokeballs || 0;
        state.totalPokeballs += donnesCompte.totalPokeballs || 0;
        state.parClick = Math.max(state.parClick, donnesCompte.parClick || 1);
        state.multiplicateurGlobal = Math.max(state.multiplicateurGlobal, donnesCompte.multiplicateurGlobal || 1);
        
        if (donnesCompte.passif) {
            for (const nom in donnesCompte.passif) {
                if (state.passif[nom]) {
                    state.passif[nom].niveau = Math.max(state.passif[nom].niveau, donnesCompte.passif[nom].niveau || 0);
                }
            }
        }
    }

  },
  getters:{
    coutProchainNiveau: (state) => (nom) => {
        const item = state.passif[nom];
        return Math.floor(item.coutBase * Math.pow(1.15, item.niveau));
    },

    productionTotaleParSeconde : (state) => {
        let total = 0;
        for (const nom in state.passif) {
            const item = state.passif[nom];
            total += item.productionParSeconde * item.niveau;
        }
        return total;
    },

    achetable: (state, getters) => (nom) => {
        const cout = getters.coutProchainNiveau(nom);
        return state.pokeballs >= cout;
    },

    etatSauvegardable: (state) => {
        const passifCopie = {};
        for (const nom in state.passif) {
            passifCopie[nom] = {
                niveau: state.passif[nom].niveau
            };
        }
        return {
            pokeballs: state.pokeballs,
            totalPokeballs: state.totalPokeballs,
            parClick: state.parClick,
            multiplicateurGlobal: state.multiplicateurGlobal,
            passif: passifCopie
        };
    }
  },
  actions: {
    async demarrerProductionAutomatique({commit, getters}) {
        setInterval(() => {
            const production = getters.productionTotaleParSeconde;
            if(production > 0) {
                commit('ajouterPokeball', production);
            }
        }, 1000);
    },

    async acheterAmelioration({commit, getters, state}, nom) {
        const cout = getters.coutProchainNiveau(nom);
        if (state.pokeballs >= cout) {
            commit('acheterPassif', {nom, cout});
        }
    },

    chargerEtat({commit}, donnees){
        commit('chargerEtat', donnees);
    },
    
    reinitialiserEtat({commit}){
        commit('reinitialiserEtat');
    },

    fusionnerEtCharger({commit}, donnesCompte){
        commit('fusionnerEtat', donnesCompte);
    },

    sauvegarderInvite({getters}){
        localStorage.setItem('pokeball-clicker-invite', JSON.stringify(getters.etatSauvegardable));
    },

    chargerInvite({commit}){
        const donnees = localStorage.getItem('pokeball-clicker-invite');
        if(donnees){
            commit('chargerEtat', JSON.parse(donnees));
        }
    },
    effacerInvite({commit}){
        localStorage.removeItem('pokeball-clicker-invite');
    }
  }
};