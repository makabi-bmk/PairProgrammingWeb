<template>
    <div>
    <!-- <h1>User Profile</h1> -->
    <!-- <p v-if="User != null">Your e-mail is {{ User.email }}</p>
    <button @click="logout">Logout</button>
    <p>ID = {{ message }}</p> -->
<v-tabs>
  <v-tab href="#tab-1">One</v-tab>
  <v-tab href="#tab-2">Two</v-tab>
  <v-tab href="#tab-3">Three</v-tab>

  <v-tab-item value="tab-1">
    Tab 1 Content
  </v-tab-item>
  <v-tab-item value="tab-2">
    Tab 2 Content
  </v-tab-item>
  <v-tab-item value="tab-3">
    Tab 3 Content
  </v-tab-item>
</v-tabs>
  </div>
</template>

<script>
export default {
  layout: "default",
  name: "home",
//   middleware: "auth",
  data() {
    return {
      tab: 1,
      User: this.$store.state.authUser,
      message: this.$store.state.classID
    }
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
    },
    // mounted() {
    //   console.log(this.$store.state.classID)
    // }
  }
}
</script>

<style scoped>
div {
  width: 100%;
}
v-tabs {
  width: 100%;
}
v-tab {
  width: 50px;
}
</style>