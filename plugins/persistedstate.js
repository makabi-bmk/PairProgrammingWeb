import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    key: 'PairProgrammingApp',
    paths: [
        'classID',
        'student_name',
        'pair_num'
    ],
    storage: window.sessionStorage,
  })(store)
}