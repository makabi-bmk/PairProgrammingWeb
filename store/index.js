// import createPersistedState from 'vuex-persistedstate';

export const state = () => ({
    authUser: null,
    classID: '',
    studentID: '',
    student_name: '',
    pair_num: '',
    pairID: '',
    isHelp: false
  })
  
  export const getters = {
    isLoggedIn: state => !!state.authUser
  }
  
  export const actions = {
    async nuxtServerInit({ dispatch }, ctx) {
      if (this.$fire.auth === null) {
        throw 'nuxtServerInit Example not working - this.$fire.auth cannot be accessed.'
      }
  
      if (ctx.$fire.auth === null) {
        throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
      }
  
      if (ctx.app.$fire.auth === null) {
        throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
      }
  
      if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
        const { allClaims: claims, ...authUser } = ctx.res.locals.user
  
        console.info(
          'Auth User verified on server-side. User: ',
          authUser,
          'Claims:',
          claims
        )
  
        await dispatch('onAuthStateChanged', {
          authUser,
          claims,
        })
      }
    },
  
    async onAuthStateChanged({ commit }, { authUser, claims }) {
      if (!authUser) {
        // ログアウトしたらページ遷移します
        await this.$router.push("/login-student")
        commit('RESET_STORE')
        return
      }
  
      if (authUser && claims) {
        try {
        // ログインしたらページ遷移します
        console.log("login successed")
          await this.$router.push("/home")
        } catch (e) {
          console.error(e)
        }
      }
      commit('SET_USER', { authUser, claims })
    }
  }
  
  export const mutations = {
    // stateを空にします
    RESET_STORE(state) {
      state.authUser = null
    },
    // stateにpayloadをセットします
    SET_USER(state, { authUser, claims }) {
      state.authUser = {
        uid: authUser.uid,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        displayName: authUser.displayName,
        photoURL: claims.picture,
        isAdmin: claims.admin
      }
    },
    SET_CLASS(state, classID) {
      state.classID = classID;
    },
    SET_STUDENT(state, studentID) {
      state.studentID = studentID;
    },
    SET_STUDENT_NAME(state, student_name) {
      state.student_name = student_name;
    },
    SET_PAIR_NUM(state, pair_num) {
      state.pair_num = pair_num;
    },
    SET_PAIR(state, pairID) {
      state.pairID = pairID;
      // if (!state.pairID.includes(newPairID)) {
      //   state.pairID.push(newPairID);
      // }
    },
    SET_IS_HELP(state, isHelp) {
      state.isHelp = isHelp;
    }
  }