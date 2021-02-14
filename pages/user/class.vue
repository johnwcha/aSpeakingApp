<template>
  <v-card min-width="400" class="mx-auto">

    <v-app-bar dark color="orange lighten-1">
      <v-toolbar-title> Class </v-toolbar-title>
      <v-spacer></v-spacer>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="white"
                ></v-progress-circular>
    </v-app-bar>

      <v-card-text>
        <template v-for="(item, index) in enrollClass">
          <v-row
            :key="item.classid"
            align="center"
          >
            <v-col cols="1" />
            <v-col cols="2">
              <v-list-item-action>
                <v-checkbox
                  :key="index"
                  v-model="enrolled"
                  :value="item.classid"
                  color="purple"
                  @change="doEnroll($event, index, enrollClass[index].classid)"
                />
              </v-list-item-action>
            </v-col>

            <v-col cols="3">
              <div
                class="font-weight-light"
                v-text="item.course"
              />
            </v-col>

            <v-col
              cols="3"
            >
              <div
                class="font-weight-light"
                v-text="item.inst"
              />
            </v-col>
            <v-col
              cols="3"
            >
              <div
                class="font-weight-light blue--text"
                v-text="item.enrolled"
              />
            </v-col>
          </v-row>
        </template>
      </v-card-text>

<v-divider></v-divider>
<p class="font-weight-light ml-5 mt-5 mb-5"> 'Check' the class to get enrolled </p>

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
        loading: false,
        sbtimeout: 0,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
      //myClass: [],
      //newClass: '',
      enrollClass: [],
      enrolled: [],
      //doEnrollCount: [],
    }),
    computed: {
        user () {
            return this.$store.getters['getUser'];
        }
    },
    mounted() {
        this.enrollInit()
    },
    methods: {
      doEnroll: function (event, index, classid) {
        //console.log(event, 'with index : ', index, classid)
        this.classid = classid
        const pos = this.enrolled.indexOf(classid)
        let actionType = ''
        // add or drop
        if (pos !== -1) {
          console.log('add course')
          actionType = 'add'
          // this.doEnrollCount.push(this.$store.state.user.data.displayName)
        } else {
          console.log('drop class')
          actionType = 'drop'
          // this.doEnrollCount
        }

        //return;

        // get the class enrollment using the id
        let thisEnrollment = []
        this.$fireStore.collection('classes').doc(classid).get()
          .then(doc => {
            if (doc.data().enrollment) {
              //console.log(doc.data().enrollment)
              thisEnrollment = doc.data().enrollment
            } else {
              //console.log(doc.data().enrollment)
            }
            // nested db query - very ugly
            if (actionType === 'add') {
              thisEnrollment.push(this.user.email)
            } else if (actionType === 'drop') {
              const i = thisEnrollment.indexOf(this.user.email)
              if (i === -1) {
                console.log('there is a problem')
              } else {
                thisEnrollment.splice(i, 1)
              }
            }
            //console.log(thisEnrollment)
            // update class.enrollment field
            this.$fireStore.collection('classes').doc(classid).update({ enrollment: thisEnrollment })
              .then(() => {
                this.sbcolor = 'success'
                this.sbtext = 'Success: enrollment record updated'
                this.snackbar = true
                //console.log('success updating enrollment record')
              }).catch(error => {
                console.log(error)
              })
            // end nested db query
          }).catch(error => {
            console.log(error)
          })
          //console.log(this.enrolled)
        this.submitEnroll()
      },
      submitEnroll() {
        //this.$store.dispatch('submitEnroll', this.enrolled)
        this.$fireStore.collection('users').doc(this.user.email)
          .set({enrolled: this.enrolled},{merge: true})
          .then(() => {
            console.log('success updating enrolled classes')
            var temp = []
            this.enrollClass.forEach(item => {
              item.enrolled = this.enrolled.indexOf(item.classid) === -1 ? '' : 'Enrolled'
              temp.push(item)
            })
            this.enrollClass = temp

          }).catch(error => {
            console.log(error)
          })
      },
      enrollInit() {
        this.loading = true
        this.enrollClass = []
        //console.log(this.user)
        this.$fireStore.collection('classes').where('school', '==', this.user.school)
          .orderBy('displayName').get().then(query => {
            this.loading = false
            query.forEach(doc => {
                //console.log(doc)
              var enrolled
              var temp = ''
              if (localStorage.enrolled) {
                enrolled = localStorage.enrolled
                temp = enrolled.indexOf(doc.id) === -1 ? '' : 'Enrolled'
              }
              this.enrollClass.push({ enrolled: temp, classid: doc.id, course: doc.data().class, inst: doc.data().displayName })
            })
          }).catch(error => {
            console.log(error)
          })
        // get enrollment info
        this.$fireStore.collection('users').doc(this.user.email).get().then(query => {
            const curEnrolled = query.data().enrolled // ["qeyL3jGdQWO2xU1XJ6Sk"] array of class id
            //console.log(curEnrolled)
            if (curEnrolled && curEnrolled.length>0) {
                this.enrolled = query.data().enrolled
                curEnrolled.forEach(courseid => {
                    this.enrollClass.forEach(item => {
                        if (item.classid === courseid) {
                            item.enrolled = 'enrolled'
                        }
                    })
                })
            }
            //console.log( this.enrollClass )

        }).catch(error => {
            console.log(error)
        })
      },
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