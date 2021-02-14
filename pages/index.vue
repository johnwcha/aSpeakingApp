<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <!-- 22222222222222 -->
      <!-- 33333333333333 -->
      <v-col cols="12">
        <v-img src="/speaking.png"></v-img>
      </v-col>

      <v-col cols="12">
          <v-btn @click="googleLogin" class="mr-5 primary"> Teacher login </v-btn>
          <v-btn @click="stuLogin" class="ml-5 success"> Student login </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import Cookies from 'js-cookie'

  export default {
    data () {
      return {
      }
    },
    mounted() {
      this.$fireAuth.onAuthStateChanged(user => {
        if (user) {
          //console.log(user, 'User signed in')
          //var isAnonymous = user.isAnonymous;
          //var uid = user.uid;
          this.$fireAuth.currentUser.getIdToken(true).then( token => {
            //console.log( token )
            Cookies.set('ncacls_token', token)
          })
          //console.log(localStorage.speakingUserRole)
          if (localStorage.speakingUserRole === 'student') {
            this.$store.commit('setUserRole', 'student')
            this.$router.push('user/account')
          } else {
            this.$store.commit('setUserRole', 'teacher')
            this.$router.push('inst/profile')
          }
          // ...
        } else {
          this.$router.push('/')
          Cookies.remove('ncacls_token')
        }
      }),
      this.$fireAuth.getRedirectResult().then(result => {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken
          // The signed-in user info.
          var user = result.user
          console.log(token)
        }
      }).catch(error => {
        // Handle Errors here.
        alert( error.message )
        console.log(error)
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
    },
    methods: {
      stuLogin() {
        //console.log(this.$fireAuth.currentUser)
        localStorage.speakingUserRole = 'student'
        if (!this.$fireAuth.currentUser) {
          const provider = new this.$fireAuthObj.GoogleAuthProvider()
          this.$fireAuth.signInWithRedirect(provider)
        }
      },
      complete (index) {
        this.list[index] = !this.list[index]
      },
      googleLogin () {
        //console.log(this.$fireAuth.currentUser)
        localStorage.speakingUserRole = 'teacher'
        this.$router.push('inst/profile')
        if (!this.$fireAuth.currentUser) {
          const provider = new this.$fireAuthObj.GoogleAuthProvider()
          this.$fireAuth.signInWithRedirect(provider)
        }
      }
    },
  }
</script>
