// export mutations as an object
export default {
    ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
        if (!authUser) {
          // claims = null
          // perform logout operations
        } else {
            state.uid = authUser.uid
            //console.log( authUser )
            //console.log( claims )
        }
    },
    setUID: (state, uid) => {
        state.uid = uid
    },
    setUserRole: (state, role) => {
        state.role = role
        //console.log( role )
        if (role === 'teacher') {
            state.items = [ { icon: 'mdi-apps', title: 'Welcome', to: '/' },
                { icon: 'mdi-account-circle', title: 'Profile', to: '/inst/profile' },
                { icon: 'mdi-file-presentation-box', title: 'Classes', to: '/inst/class' },
                { icon: 'mdi-chart-bubble', title: 'Vocab Quiz', to: '/inst/manageQuiz' },
                { icon: 'mdi-chart-bubble', title: 'Speaking', to: '/inst/manageSpeaking' }]
        } else {
            state.items = [ { icon: 'mdi-apps', title: 'Welcome', to: '/' },
                { icon: 'mdi-account', title: 'Account', to: '/user/account' },
            { icon: 'mdi-file-presentation-box', title: 'Class', to: '/user/class' },
            { icon: 'mdi-chart-bubble', title: 'Speaking', to: '/user/speaking' }]
        }
    },
    resetItems: (state) => {
        state.items = [
            {
              icon: 'mdi-apps',
              title: 'Welcome',
              to: '/'
            }
          ]
    },
}