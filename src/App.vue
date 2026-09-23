<script >
import CompteurPokeballs from './components/CompteurPokeballs.vue'
import ListeAmeliorations from './components/ListeAmeliorations.vue'
import Connexion from './components/Connexion.vue'
export default {
  name: 'App',
  components: {
    CompteurPokeballs,
    Connexion,
    ListeAmeliorations
  }
};
</script>

<template>
  <Connexion />
  <div id="app">
    <h1> Pokéball Cliker</h1>
    <CompteurPokeballs />
    <ListeAmeliorations />
  </div>
</template>

<style scoped></style>
