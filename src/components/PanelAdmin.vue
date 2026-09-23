<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'PanelAdmin',
  data() {
    return {
      nouveauxScores: {}
    }
  },

  computed: {
    ...mapGetters('users', ['estAdmin', 'classement'])
  },

  methods: {
    ...mapActions('users', ['modifierScoreJoueur', 'reinitialiserJeu']),

    appliquerScore(nom) {
      const valeur = this.nouveauxScores[nom]
      if (valeur === undefined || valeur === '') return
      this.modifierScoreJoueur({ nom, nouveauScore: valeur })
      this.nouveauxScores[nom] = ''
    },

    confirmerReset() {
      if (confirm('Réinitialiser TOUS les scores ? Cette action est irréversible.')) {
        this.reinitialiserJeu()
      }
    }
  }
}
</script>

<template>
  <div v-if="estAdmin" class="panel-admin">
    <h3>Panel Administrateur</h3>

    <div v-for="joueur in classement" :key="joueur.nom" class="ligne-admin">
      <span>{{ joueur.nom }} ({{ Math.floor(joueur.pokeballs) }} 🎾)</span>

      <input
        v-model.number="nouveauxScores[joueur.nom]"
        type="number"
        placeholder="Nouveau score"
      />
      <button @click="appliquerScore(joueur.nom)">Modifier</button>
    </div>

    <button class="bouton-danger" @click="confirmerReset">Réinitialiser tous les scores</button>
  </div>
</template>

<style scoped>
.panel-admin {
  max-width: 500px;
  margin: 20px auto;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 15px;
}

.ligne-admin {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.ligne-admin input {
  width: 100px;
}

.bouton-danger {
  margin-top: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>