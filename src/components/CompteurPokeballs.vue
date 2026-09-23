<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CompteurPokeballs',

  computed: {
    ...mapState('pokeballs', ['pokeballs', 'parClick']),
    ...mapGetters('pokeballs', {productionParSeconde: 'productionTotaleParSeconde'})
  },

  methods: {
    ...mapMutations('pokeballs', ['cliquer'])
  },

  mounted() {
    this.$store.dispatch('pokeballs/demarrerProductionAutomatique')
  }
}
</script>

<template>
  <div class="compteur">
    <img src="../image/pokeball.png" alt="Poké Ball" class="pokeball-img" @click="cliquer" />

    <h2>{{ Math.floor(pokeballs) }} Poké Balls</h2>
    <p>{{ productionParSeconde.toFixed(1) }} / seconde</p>
    <p>+{{ parClick }} par clic</p>

    <!-- <button @click="cliquer">Lancer une Poké Ball </button> -->
  </div>
</template>

<style scoped>
.compteur {
  text-align: center;
  padding: 20px;
}

.pokeball-img {
  width: 120px;
  cursor: pointer;
  transition: transform 0.1s;
}

.pokeball-img:active {
  transform: scale(0.9);
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
</style>