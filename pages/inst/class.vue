<template>
  <v-card min-width="400" class="mx-auto">

    <v-app-bar dark color="orange lighten-1">
      <v-toolbar-title> Classes & Roster </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

      <v-simple-table>
        <thead>
          <tr>
            <th class="warning--text">
              #
            </th>
            <th class="warning--text">
              Class
            </th>
            <th class="warning--text text-right">
              # students / view roster
            </th>
            <th class="warning--text text-right">
              delete
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, i) in myClass"
            :key="item.id"
            name
          >
            <td> {{ i + 1 }} </td>
            <td> {{ item.class }} </td>
            <td class="text-right"> {{ item.enrollment.length }} / 
              <v-icon class="green--text mr-3" @click="viewRoster(item)">
                mdi-file-document-outline
              </v-icon>
            </td>
            <td class="text-right">
              <v-icon @click="confirmDelete(item)" class="green--text mr-3"> mdi-delete </v-icon>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-row class="mx-3">
        <v-col
          cols="8"
        >
          <v-text-field
            v-model="newClass"
            label="Enter new class (ex: Chinese I)"
          />
        </v-col>
        <v-col
          cols="4"
          class="text-right"
        >
          <v-btn color="orange lighten-1" :disabled="newClass===''" @click="createClass">
            Create Class
          </v-btn>
        </v-col>
      </v-row>

<v-dialog
      v-model="classDialog"
      scrollable max-width="300px"
    >
      <v-card>
        <v-card-title class="headline"> Confirm </v-card-title>
      
      <v-divider></v-divider>
      
        <v-card-text >
          <p></p>
          <p> Confirm deletion of class: {{ delContent }} ?</p>
        </v-card-text>

      <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="classDialog = false" > Cancle </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteClass(delID)" > Delete </v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>

<v-dialog
      v-model="dialog"
      scrollable max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Enrolled students email</v-card-title>
      
      <v-divider></v-divider>
      
        <v-card-text >
          <p></p>
          <p v-for="item in stuEmail" :key="item">{{ item }}</p>
        </v-card-text>

      <v-divider></v-divider>
        <v-card-actions>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>

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
      classDialog: false,
      delContent: '',
      dialog: false,
        sbtimeout: 0,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
        myClass: [],
        newClass: '',
        stuEmail: [],
    }),
    methods: {
      viewRoster(item) {
        if (item.enrollment.length>0) {
          this.dialog = true
          //console.log(item)
          this.stuEmail = item.enrollment
        }
      },
      confirmDelete(item) {
        //console.log(item)
        this.classDialog = true
        this.delID = item.id
        this.delContent = item.class
      },
      deleteClass(id) {
        this.classDialog = false
        this.$fireStore.collection('classes').doc(id).delete()
          .then(() => {
            this.sbcolor = 'success'
            this.sbtext = 'Success: Class deleted'
            this.snackbar = true
            this.sbtimeout = 6000
            this.init()
          }).catch(error => {
            console.log(error)
          })
      },
      createClass() {
        this.$fireStore.collection('classes')
          .add({ enrollment: [], school: this.user.school, displayName: this.user.displayName, class: this.newClass, email: this.user.email, time: new Date() })
          .then(data => {
            //console.log(data.id)
            this.sbcolor = 'success'
            this.sbtext = 'Success: New class created'
            this.snackbar = true
            this.sbtimeout = 6000
            this.myClass.push({ id: data.id, class: this.newClass, enrollment: [] })
          }).catch(error => {
            console.log(error)
          })
      },
      init() {
        this.myClass = []
        this.$fireStore.collection('classes').where('email', '==', this.user.email)
          .orderBy('time').get().then(query => {
              //console.log(query)
              if (!query.size) { 
                this.sbcolor = 'info'
                this.sbtext = 'Info: Create a new class to begin'
                this.snackbar = true
              } 
              if (query.size>0) {
                console.log('process query results')
                query.forEach(doc => {
                    //console.log(doc.data())
                    this.myClass.push({ ...doc.data(), id: doc.id })
                })
                //console.log(this.myClass)
              }
          }).catch(error => {
            console.log(error)
          })
      }
    },
    computed: {
        user () {
            return this.$store.getters['getUser'];
        }
    },
    mounted() {
        //console.log( this.user )
        this.init()
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