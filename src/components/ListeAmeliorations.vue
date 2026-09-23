<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ListeAmeliorations',

  computed: {
    ...mapState('pokeballs', ['passif']),
    ...mapGetters('pokeballs', ['coutProchainNiveau', 'achetable'])
  },

  methods: {
    ...mapActions('pokeballs', {
      acheterAmelioration: 'acheterAmelioration'
    }),

    acheter(nom) {
      this.acheterAmelioration(nom)
    },

    estAchetable(nom) {
      return this.achetable(nom)
    },

    formatNom(nom) {
      // ramoloss -> Ramoloss, centrePokemon -> Centre Pokemon
      return nom
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    }
  }
}
</script>

<template>
  <div class="ameliorations">
    <h3>Améliorations</h3>

    <div
      v-for="(item, nom) in passif"
      :key="nom"
      class="carte-amelioration"
      :class="{ desactive: !estAchetable(nom) }"
    >
      <div class="infos">
        <strong>{{ formatNom(nom) }}</strong>
        <span>Niveau {{ item.niveau }}</span>
        <span>+{{ item.productionParSeconde }} balls/s chacun</span>
      </div>

      <button
        :disabled="!estAchetable(nom)"
        @click="acheter(nom)"
      >
        Acheter ({{ coutProchainNiveau(nom) }} 🎾)
      </button>
    </div>
  </div>
</template>

<style scoped>
.ameliorations {
  max-width: 400px;
  margin: 20px auto;
}

.carte-amelioration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
}

.carte-amelioration.desactive {
  opacity: 0.5;
}

.infos {
  display: flex;
  flex-direction: column;
  text-align: left;
}

button {
  cursor: pointer;
  padding: 6px 12px;
}

button:disabled {
  cursor: not-allowed;
}
</style>