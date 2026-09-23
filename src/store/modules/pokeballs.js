export default {
    namespaced: true,
    state: {
        pokeballs: 0,
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
    },

    cliquer(state){
        state.pokeballs += state.parClick * state.multiplicateurGlobal
    },

    acheterPassif(state, {nom, cout}){
        state.pokeballs -= cout
        state.passif[nom].niveau++
    },

    definirMultiplicateur(state, valeur){
        state.multiplicateurGlobal = valeur
    },

    chargerPokeballs(state, quantite){
        state.pokeballs = quantite
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
    }
  },
  actions: {
    async demarrerProductionAutomatique({commit, getters}) {
        setInterval(() => {
            const production = getters.productionTotaleParSeconde;
            commit('ajouterPokeball', production);
        }, 1000);
    },

    async acheterAmelioration({commit, getters, state}, nom) {
        const cout = getters.coutProchainNiveau(nom);
        if (state.pokeballs >= cout) {
            commit('acheterPassif', {nom, cout});
        }
    },

    chargerPokeballs({commit}, quantite){
        commit('chargerPokeballs', quantite);
    }
  }
};