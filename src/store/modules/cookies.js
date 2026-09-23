export default {
  namespaced: true,
  state: {
    cookies: 0
  },
  mutations:{
    ajouterCookie(state){
        state.cookies++
    }
  },
  getters:{
    doubleCookies(state){
        return state.cookies * 2
    }
  },
  actions: {
    async ajouterCookieAvecDelai({commit}){
      setTimeout(() => {
        commit('ajouterCookie')
      }, 1000)
    }
  }
};