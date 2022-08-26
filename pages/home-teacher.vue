<template>
  <div>
    <h1>User Profile</h1>
    <p v-if="User != null">Your e-mail is {{ User.email }}</p>
    <button @click="logout">Logout</button>
    <p>ID = {{ message }}</p>
  </div>
</template>

<script>
export default {
  layout: "default",
  name: "home",
//   middleware: "auth",
  data() {
    return {
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