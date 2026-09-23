<script >
import CompteurPokeballs from './components/CompteurPokeballs.vue'
import ListeAmeliorations from './components/ListeAmeliorations.vue'
import Connexion from './components/Connexion.vue'
import Leaderboard from './components/Leaderboard.vue'
import PanelAdmin from './components/PanelAdmin.vue'
export default {
  name: 'App',
  components: {
    CompteurPokeballs,
    Connexion,
    ListeAmeliorations,
    Leaderboard,
    PanelAdmin
  }
};
</script>

<template>
  <Connexion />
  <div id="app">
    <h1> Pokéball Cliker</h1>
    <CompteurPokeballs />
    <Leaderboard />
    <PanelAdmin />
    <ListeAmeliorations />
  </div>
</template>

<style scoped></style>
