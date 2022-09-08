import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    key: 'PairProgrammingApp',
    paths: [
        'classID'
    ],
    storage: window.sessionStorage,
  })(store)
}