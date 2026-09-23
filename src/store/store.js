import {createStore} from 'vuex'
import pokeballs from './modules/pokeballs.js'
import users from './modules/users.js'

export default createStore({
  modules: {
    pokeballs,
    users
  }
});