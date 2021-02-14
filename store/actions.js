export default {
    onAuthStateChangedAction: (state, { authUser, claims }) => {
        if (!authUser) {
          // claims = null
      
          // perform logout operations
        } else {
            const { uid, email, emailVerified } = authUser
            state.user = { uid, email, emailVerified }
            state.uid = authUser.uid
            //console.log( authUser )
            //console.log( claims )
        }
    }
}

