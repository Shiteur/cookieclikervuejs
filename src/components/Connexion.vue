<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Connexion',
  data() {
    return {
      nom: '',
      motDePasse: '',
      message: ''
    }
  },

  computed: {
    ...mapGetters('users', ['estConnecte', 'utilisateurActuel'])
  },

  created() {
    this.$store.dispatch('users/initialiser')
  },

  methods: {
    ...mapActions('users', ['inscrire', 'connecter', 'deconnecter']),

    async gererInscription() {
      const resultat = await this.inscrire({ nom: this.nom, motDePasse: this.motDePasse })
      this.message = resultat.succes ? 'Compte créé ! Vous pouvez vous connecter.' : resultat.message
    },

    async gererConnexion() {
      const resultat = await this.connecter({ nom: this.nom, motDePasse: this.motDePasse })
      this.message = resultat.succes ? '' : resultat.message
    },

    gererDeconnexion() {
      this.deconnecter()
    }
  }
}
</script>

<template>
  <div v-if="!estConnecte" class="connexion">
    <h3>Connexion Dresseur</h3>
    <input v-model="nom" placeholder="Nom de dresseur" />
    <input v-model="motDePasse" type="password" placeholder="Mot de passe" />

    <div class="boutons">
      <button @click="gererConnexion">Se connecter</button>
      <button @click="gererInscription">Créer un compte</button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </div>

  <div v-else class="profil">
    <p>Connecté en tant que <strong>{{ utilisateurActuel.nom }}</strong></p>
    <button @click="gererDeconnexion">Se déconnecter</button>
  </div>
</template>

<style scoped>
.connexion, .profil {
  max-width: 300px;
  margin: 20px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  padding: 6px;
}
.boutons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.message {
  color: #c0392b;
  margin-top: 8px;
}
</style>