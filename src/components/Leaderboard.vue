<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Leaderboard',
  computed: {
    ...mapGetters('users', ['classement', 'utilisateurActuel'])
  },

  methods: {
    medaille(index) {
      const medailles = ['or', 'argent', 'bronze']
      return medailles[index] || '  '
    }
  }
}
</script>

<template>
  <div class="leaderboard">
    <h3>Classement des Dresseurs</h3>

    <ol class="liste-classement">
      <li v-for="(joueur, index) in classement" :key="joueur.nom" :class="{ 'moi': utilisateurActuel && joueur.nom === utilisateurActuel.nom }">
        <span class="rang">{{ medaille(index) }} #{{ index + 1 }}</span>
        <span class="nom">{{ joueur.nom }}</span>
        <span class="score">{{ Math.floor(joueur.pokeballs) }} Pokeballs</span>
        <span class="role" v-if="joueur.role === 'admin'">Admin</span>
      </li>
    </ol>

    <p v-if="classement.length === 0" class="vide">Aucun dresseur enregistré pour l'instant.</p>
  </div>
</template>

<style scoped>
.leaderboard {
  max-width: 400px;
  margin: 20px auto;
}

.liste-classement {
  list-style: none;
  padding: 0;
}

.liste-classement li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}

.liste-classement li.moi {
  background-color: #fff3cd;
  border-radius: 6px;
  font-weight: bold;
}

.rang {
  width: 50px;
}

.nom {
  flex: 1;
  text-align: left;
}

.vide {
  color: #888;
  font-style: italic;
}
</style>