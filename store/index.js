// export state as a function
// https://www.reddit.com/r/Nuxt/comments/am359z/nuxtjs_with_vuex_state_modules/
export const state = () => ({
  user: null,
  uid: null,
  role: null,
  enrolled: [],
  items: [
    {
      icon: 'mdi-apps',
      title: 'Welcome',
      to: '/'
    }
  ],
})

export const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
  setEnrolled: (state, enrolled) => {
    state.enrolled = enrolled
  }
}

export const getters = {
  getUser: state => {
    return state.user
  },
  getEnrolled: state => {
    return state.enrolled
  }
}

/*
    { icon: 'mdi-chart-bubble', title: 'Inspire', to: '/inspire' }
*/