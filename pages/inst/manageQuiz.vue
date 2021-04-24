<template>
  <v-card min-width="800">
    <v-app-bar dark color="purple lighten-1">
      <v-toolbar-title> Vocab Quiz </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

<!-- Create Quiz --> <!-- 1 Add vocab unit -->
<v-container>
<v-row> 
    <!--Grid column-->
    <v-col cols="6" class="col-6 col-md-4">
        <v-select outlined :return-object="true" @change="selectClass"
             :items="classes" item-text="class" label="Select class">
        </v-select>
    </v-col>
    <!--Grid column-->
    <v-col cols="6" class="col-6 col-md-5">
        <v-text-field v-model="newUnit" label="Ex: unit 1"></v-text-field>
    </v-col>
    <!--Grid column-->

    <v-col cols="6" class="col-6 col-md-3 row">
        <v-btn class="info" @click="addUnit" :disabled="newUnit==''"> Add </v-btn>
    </v-col> 
</v-row>
<!-- Create Quiz END -->
<v-row>
<v-col cols="6">
    <div style="height: 700px; overflow: auto">
    <v-simple-table >
        <thead>
        <tr>
            <th class="blue--text">#</th>
            <!-- th class="blue--text">Class</th -->
            <th class="blue--text">Lesson / Unit</th>
            <th class="blue--text">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,i) in quizzes" :key="item.classid" name >
            <td> {{ i+1 }} </td>
            <!-- td> {{ item.class }} </td -->
            <td> {{ item.unit }} </td>
            <td>
                <v-btn small color="success" @click="editQuiz(item)"> <v-icon left> mdi-pencil</v-icon>  </v-btn>
                <v-btn small color="warning" @click="delQuiz(item)"> <v-icon left> mdi-delete </v-icon>  </v-btn>
                <v-btn small color="info" @click="perQuiz(item)"> <v-icon left> mdi-finance</v-icon>  </v-btn>
            </td>
        </tr>
        </tbody>
    </v-simple-table>
    </div>
</v-col>
<v-col cols="6">
    <div v-if="editMode"> <!-- EDIT -->
    <p class="note note-primary"><strong>Editing: </strong> {{ currentEdit }} </p>
    <v-btn color="yellow" small v-if="quizQues.length>0" @click="saveQuiz"> save </v-btn>
    <v-row>
        <v-col cols="4">
            <v-text-field v-model="char" label="Chinese trad--simp"></v-text-field>
        </v-col>
        <v-col cols="6">
            <v-text-field v-model="eng" label="English"></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-btn small :disabled="currentEdit==''" class="success" @click="addQue"> + </v-btn>
        </v-col>
    </v-row>
    <v-simple-table >
        <thead>
        <tr>
            <th class="blue--text">#</th>
            <th class="blue--text">Chinese</th>
            <th class="blue--text">English</th>
            <th class="blue--text">Remove</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,i) in quizQues" :key="item.classid" name >
            <td> {{ i+1 }} </td>
            <td> <v-text-field v-model="item.char"></v-text-field> </td>
            <td> <v-text-field v-model="item.eng"></v-text-field> </td>
            <td>
                <v-btn small color="info"> <v-icon left> mdi-delete </v-icon> </v-btn>
            </td>
        </tr>
        </tbody>
    </v-simple-table>
    </div>
    <v-card> <!-- Performance -->
    <v-simple-table >
        <thead>
        <tr>
            <th class="blue--text">@ {{ curPerQuiz }} </th>
            <th class="blue--text">%</th>
            <th class="blue--text">Duration</th>
            <th class="blue--text">Time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,i) in perArray" :key="i" name @click="showDetail(item)" >
            <td> {{ item.email }} </td>
            <td> <span :class="item.percentage=='100.0' ? 'pink--text' : ''"> {{ item.percentage }} </span> </td>
            <td> <span> {{ item.duration }} </span></td>
            <td> {{ dayjs.unix(item.time.seconds).format('h:mm:ss A • M/D/YYYY') }} </td>
        </tr>
        </tbody>
    </v-simple-table>

    </v-card>
</v-col>
</v-row>
</v-container> 
  </v-card>
</template>

<script>
import { getUserFromCookie } from '@/helper'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-storage'

export default {
    data: () => ({
      loading: true,
      classes: [],
      selClass: '',
      selClassid: '',
      newUnit: '',
      quizzes: [],
      currentEdit: '',
      editMode: true,
      curEditQuiz: {},
      currentEditid: '',
      quizQues: [],
      char: '',
      eng: '',
      perArray: [],
      curPerQuiz: '',
    }),
    methods: {
      showDetail(item) {
        console.log(item)
      },
      saveQuiz(){
        console.log(this.quizQues, this.currentEditid)
        this.$fireStore.collection('vocab_units').doc(this.currentEditid).update({que: this.quizQues})
        .then(()=>{
          console.log('quiz save success')
        }).catch(error =>{ console.log(error.message) })
      },
      addQue(){
        this.quizQues.push({char: this.char, eng: this.eng})
        this.char = ''
        this.eng = ''
      },
      editQuiz(item){
        console.log(item)
        this.curEditQuiz = item
        this.currentEdit = item.unit
        this.currentEditid = item.id
        this.quizQues = item.que
      },
      delQuiz(item){

      },
      perQuiz(item){
        console.log(item)
        this.curPerQuiz = item.unit
        this.perArray = []
        this.$fireStore.collection('vocab_quiz_stats').where('unitid', '==', item.id).orderBy('email').get().then(res => {
          console.log(res)
          if (res.size>0) {
            res.forEach(item => {
              this.perArray.push({ ...item.data() })
            })
          }
        })
      },
      getQuiz(classid){
        this.quizzes = []
        this.$fireStore.collection("vocab_units").where('uid', '==', classid).orderBy('class','asc').orderBy('unit','asc').get()
          .then(doc => {
            doc.forEach(item => {
                //console.log(item.data())
                this.quizzes.push( {id: item.id, ...item.data()} )
            })
          }).catch(error => { console.log(error.message) })
      },
      selectClass(obj){
        console.log(obj)
        this.selClass = obj.class
        this.selClassid = obj.classid
        this.getQuiz(obj.classid)
      },
      addUnit(){
        console.log(this.selClass, this.selClassid, this.newUnit)
        const quizObj = {uid: this.selClassid, class: this.selClass, unit: this.newUnit.trim(), que: []}
        this.$fireStore.collection("vocab_units").add(quizObj).then(res =>{
            console.log(res)
            this.getQuiz(this.selClassid)
        }).catch(error => { console.log(error.message) })
      },
      init(){
        this.loading = true
        this.$fireStore.collection('classes').where('email', '==', this.user.email).orderBy('class').get()
          .then(query => {
            query.forEach(doc => {
              this.classes.push({ class: doc.data().class, classid: doc.id })
            })
            console.log(this.classes)
            this.loading = false
          }).catch(error => { console.log(error.message) })
      }
    },
    mounted() {
        console.log( this.user )
        this.init()
    },
    computed: {
      user () {
          return this.$store.getters['getUser'];
      },
      dayjs() {
        return require('dayjs');
      }
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