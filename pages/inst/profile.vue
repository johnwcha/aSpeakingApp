<template>
  <v-card min-width="400" class="mx-auto">

    <v-app-bar dark color="primary lighten-1">
      <v-toolbar-title> Profile </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-form>
        <v-container class="py-0">
            <v-row>
            <v-col cols="12" md="12">
                <v-text-field v-model="user.email" label="Email" readonly/>
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="user.displayName" label="Display Name" class="purple-input" />
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="userRole" label="Role"/>
            </v-col>

            <v-col cols="12">
                <v-text-field class="my-school" v-model="user.school" label="School" placeholder="Ex: USC"/>
            </v-col>

            <v-col cols="12" class="text-right">
                <v-btn color="light-blue" class="mr-0" dark @click="updateProfile" >
                Update Profile
                </v-btn>
            </v-col>
            </v-row>
        </v-container>
    </v-form>

<v-snackbar v-model="snackbar" :color="sbcolor" bottom :timeout="sbtimeout">
    {{ sbtext }}
    <template>
        <v-btn dark text @click="snackbar = false">
          Close
        </v-btn>
    </template>
</v-snackbar>

  </v-card>
</template>


<script>
import { getUserFromCookie } from '@/helper'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data: () => ({
        sbtimeout: 0,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
        user: {},
        userRole: 'Teacher'
    }),
    methods: {
        updateProfile() {
            //console.log( this.user )
            this.$fireStore.collection('users').doc(this.user.email)
              .set({displayName: this.user.displayName, uid: this.user.uid, email: this.user.email,
                    school: this.user.school.toUpperCase(), userRole: this.userRole}, { merge: true })
              .then(() => {
                //console.log('account updated success')
                this.sbcolor = 'success'
                this.sbtext = 'Success: profile updated'
                this.snackbar = true
                this.$store.commit('setUser', {uid: this.user.uid, email: this.user.email, 
                                                displayName: this.user.displayName, school: this.user.school.toUpperCase()})
            }).catch(error => {
                this.sbcolor = 'error'
                this.sbtext = 'Error: profile update errors encountered'
                this.snackbar = true
            })
            // update 'schools' collection
            this.$fireStore.collection('schools').doc(this.user.school.toUpperCase())
            .set({school: this.user.school.toUpperCase()}).then(() => {
                console.log('success: added school')
            }).catch(error => {
                console.log(error)
            })
        },
        checkUser() {
            console.log('checking instructor user')
            this.$fireStore.collection('users').doc(this.user.email).get().then(querysnapshot => {
                //console.log( querysnapshot )
                if (!querysnapshot.exists) {
                    //let account = {email: this.user.email, displayName: 
                    //                this.user.displayName, school: this.user.school}
                    //this.$fireStore.collection('users').doc(this.user.email).set(account).then(() => {
                        //console.log( this.user )
                        this.sbcolor = 'info'
                        this.sbtext = 'Info: enter school name to update your profile'
                        this.snackbar = true
                    //}).catch(error => {
                    //    console.log(error)
                    //})
                } else {
                    this.user = {...querysnapshot.data()}
                    this.$store.commit('setUser', {...querysnapshot.data()})
                }
            })
        }
    },
    mounted() {
        //console.log( this.$fireAuth.currentUser )
        this.user = {email: this.$fireAuth.currentUser.email,
                     displayName: this.$fireAuth.currentUser.displayName,
                     school: '',
                     uid: this.$fireAuth.currentUser.uid}
        this.checkUser()
    },
    asyncData({req, redirect}) {
        //console.log(firebase.auth())
        if (process.server) {
            const user = getUserFromCookie(req)
            //console.log( user )
            if (!user) {
                redirect('/')
            }
        } else {
            //console.log('redirect')
            let user = firebase.auth().currentUser
            if (!user) {
                redirect('/')
            }
        }
    }
}
</script>

<style scoped>
.my-school input {
  text-transform: uppercase
}
</style>