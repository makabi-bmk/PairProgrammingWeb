import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    key: 'PairProgrammingApp',
    paths: [
        'classID',
        'studentID',
        'student_name',
        'pair_num',
        'pairID',
    ],
    storage: window.sessionStorage,
  })(store)
}