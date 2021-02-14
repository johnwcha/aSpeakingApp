<template>
  <v-container>
    <v-card>
      <v-tabs background-color="pink lighten-1" center-active dark>
        <v-tab href="#manage">
          Management
        </v-tab>
        <v-tab href="#grading" :disabled="selectedUnit==''" @click="getSpeech">
          Feedback
        </v-tab>
<!-- MANAGEMENT TAB -->
        <v-tab-item value="manage">
          <v-container>
            <v-row>
              <v-col cols="4">
<!-- clesses -->
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="blue--text">
                        Classes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in classes" :key="item.classid" name >
                      <td>
                      <v-icon v-if="item.classid===selectedClassid">mdi-arrow-right-bold</v-icon>
                      <a href="#" @click="selectClass(item)" > 
                        {{ item.class }}
                      </a></td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="purple"
                ></v-progress-circular>
              </v-col>
              <v-col cols="4" >
<!-- Lessons -->
                <v-form>
                  <v-text-field @keydown="addLesson" :disabled="selectedClassid===''" v-model="newLesson"
                    label="+ Add lesson"
                  >  </v-text-field>
                </v-form>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="blue--text">
                        Lessons
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in lessons" :key="item.classid" name >
                      <td>
                        <v-row>
                          <v-col cols="10">
                        <v-icon v-if="item.lessonid===selectedLessonid">mdi-arrow-right-bold</v-icon>
                        <a href="#" @click="selectLesson(item)" > 
                            {{ item.lesson }}
                        </a> </v-col>
                        <v-col cols="2">
                        <v-icon v-if="item.lessonid===selectedLessonid" @click="confirmDeleteLesson(item)"> mdi-delete </v-icon> </v-col>
                        </v-row>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col
                cols="4"
              >
<!-- Units -->
                <v-form>
                  <v-text-field @keydown="addUnit" :disabled="selectedLesson===''"
                    v-model="newUnit"
                    label="+ Add unit"
                  >  </v-text-field>
                </v-form>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="blue--text">
                        Units
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in units" :key="item.lessonid" name >
                      <td>
                        <v-row>
                          <v-col cols="10">
                        <v-icon v-if="item.unitid===selectedUnitid">mdi-arrow-right-bold</v-icon>
                        <a href="#" @click="selectUnit(item)" > 
                            {{ item.unit }}
                        </a> </v-col>
                        <v-col cols="2">
                        <v-icon v-if="item.unitid===selectedUnitid" @click="confirmDeleteUnit(item)"> mdi-delete </v-icon> </v-col>
                        </v-row>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
<!-- MANAGEMENT TAB -->
<!-- GRADING TAB -->
        <v-tab-item value="grading" >
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="blue--text">
                        Students
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="name in stuArr" :key="name" name >
                      <td>
                        <v-icon v-if="name===curStu" >
                          mdi-arrow-right-bold
                        </v-icon>
                        <a @click="filterByName(name)" > 
                            {{ name }}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="9">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="blue--text">
                        #
                      </th>
                      <th class="blue--text">
                        Speech
                      </th>
                      <th class="blue--text">
                        @
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in filtered" :key="i" name >
                      <td>
                        {{ i+1 }}
                      </td>
                      <td v-html="item.speech" @mouseup="markup(item, $event)" style="font-family:serif; font-size:18px" />
                      <td>
                        <v-icon @click="playAudio(item.audioPath)"> mdi-play-circle </v-icon>
                        /
                        <v-icon v-if="!item.correct" @click="checkSpeech(item)"> mdi-file-outline </v-icon>
                        <v-icon v-if="item.correct" @click="checkSpeech(item)" class="green--text" > mdi-check-bold </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
<!-- GRADING TAB -->
      </v-tabs>
    </v-card>
<!-- STUDENT UI FOR TESTING PURPOSE -->
    <p v-if="selectedUnit===''" style="padding-top: 10px; padding-left:10px; margin:0px"> 
        Please select 
        <span class="red--text">'Class'</span>, 
        <span class="red--text">'Lesson'</span>, and 
        <span class="red--text">'Unit'</span> to start. </p>
    <p style="padding-top: 10px; padding-left:10px; margin:0px" > 
        Student interface below for testing purposes: </p>
    <v-card :disabled="selectedUnit===''">
      <v-row>
        <v-col cols="8" >
          <v-simple-table>
            <thead>
              <tr>
                <th class="blue--text">
                  #
                </th>
                <th class="blue--text">
                  Speech
                </th>
                <th class="blue--text">
                  @
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in mySpeech" :key="item.speechid" >
                <td> {{ i+1 }} </td>
                <td>
                  {{ item.speech }}
                </td>
                <td>
                  <v-icon @click="playAudio(item.audioPath)"> mdi-play-circle </v-icon>
                  /  
                  <v-icon @click="deleteSpeech(item.speechid, i)"> mdi-delete </v-icon>
                  /
                  <v-icon class="green--text" v-if="item.correct" > mdi-check-bold </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col cols="4" >
          <div id="results">
            <span class="purple--text"> {{ final_transcript }} </span>
            <span class="green--text">{{runtimeTranscription}}</span>
          </div>
          <div id="div_start_" class="mt-5" >
          <v-row align="center" justify="center" >
            <v-btn dark @click="startSpeechRecognition" icon
              :color="!recognizing ? 'grey' : 'red darken-3'"
              :class="{'animated infinite pulse': recognizing}"
            >
              <v-icon large>{{recognizing ? 'mdi-microphone-off' : 'mdi-microphone'}}</v-icon>
            </v-btn>
            
            <v-btn color="blue lighten-1" :disabled="recognizing" dark
              @click="submitSpeech"> Submit </v-btn>

          </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>

<v-snackbar v-model="snackbar" :color="sbcolor" bottom :timeout="sbtimeout">
    {{ sbtext }}
    <template>
        <v-btn dark text @click="snackbar = false">
          Close
        </v-btn>
    </template>
</v-snackbar>

<v-dialog
      v-model="dialog"
      scrollable max-width="300px"
    >
      <v-card>
        <v-card-title class="headline"> Confirm </v-card-title>
      
      <v-divider></v-divider>
      
        <v-card-text >
          <p></p>
          <p> Confirm deletion of {{ delContent }} ?</p>
        </v-card-text>

      <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="dialog = false" > Cancle </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteContent" > Delete </v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>

  </v-container>
</template>

<script>
import { getUserFromCookie } from '@/helper'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-storage'

export default {
    data: () => ({
      dialog: false,
      delContent: '',
      delType: '',
      delID: '',
      audio: null,
      path: '',
      mediaRecorder: null,
      audioChunks : [],
        sbtimeout: 0,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
      loading: false,
      classes: [],
      selectedClass: '',
      selectedClassid: '',
      lessons: [],
      newLesson: '',
      newLessonid: '',
      selectedLesson: '',
      selectedLessonid: '',
      units: [],
      newUnit: '',
      newUnitid: '',
      selectedUnit: '',
      selectedUnitid: '',
      stuArr: [],
      stuSpeech: [],
      curStu: '',
      filtered: [],
      unsubscribe: null,
      recognition: null,
      recognizing: null,
      error: false,
      runtimeTranscription: '',
      mySpeech: [],
      preConf: 0,
      isFinal: '',
      final_transcript: '',
      ignore_onend: false,
      comboLangSelected: { language: 'Chinese', lang: 'cmn-Hans-CN' },
//      comboLang: [{ language: 'Chinese', lang: 'cmn-Hans-CN' }, { language: 'English', lang: 'en-US' }, { language: 'Japanese', lang: 'ja-JP' }, { language: 'Korean', lang: 'ko-KR' }, { language: 'Italian', lang: 'it-IT' }, { language: 'French', lang: 'fr-FR' }, { language: 'Spanish', lang: 'es-MX' }],
    }),
    methods: {
      deleteContent() {
        this.$fireStore.collection(this.delType).doc(this.delID).delete()
        .then(() => {
          this.sbcolor = 'success'
          this.sbtext = 'Success: Content deleted'
          this.snackbar = true
          this.sbtimeout = 6000
          this.dialog = false
          if (this.delType==='units') this.selectLesson({lesson: this.selectedLesson, lessonid: this.selectedLessonid})
          if (this.delType==='lessons') this.selectClass({class: this.selectedClass, classid: this.selectedClassid})
        }).catch(error => {
          console.log(error)
        })
      },
      confirmDeleteLesson(item) {
        //console.log( item )
        this.delType = 'lessons'
        this.delContent = item.lesson
        this.delID = item.lessonid
        this.dialog = true
      },
      confirmDeleteUnit(item) {
        //console.log( item )
        this.dialog = true
        this.delContent = item.unit
        this.delID = item.unitid
        this.delType = 'units'
      },
      playAudio(path) {
        //console.log( path )
        if (this.audio) this.audio.pause()

        if (path) {
          this.$fireStorage.ref().child(path).getDownloadURL().then(url => {
            //console.log( url )
            this.audio = new Audio(url);
            this.audio.play()
          }).catch(function(error) {
            // Handle any errors
          })
        }
      },
      markup: function (item, event) {
        //console.log(window.getSelection())
        // const text = item.speech
        const range = window.getSelection().getRangeAt(0)
        //console.log(range)
        //const text = window.getSelection().getRangeAt(0).toString()
        const text = window.getSelection().isCollapsed // true, no text selected
        //console.log(text)
        const span = document.createElement('span')
        span.className = 'red--text'
        if (text) {
          //console.log('do INSERT ___')
          span.textContent = ' ___ '
          //console.log(span.innerText)
          if (event.target.nodeName == 'TD') {
              range.insertNode(span)
              this.submitMarkup( item, event.target.innerHTML )
              //console.log(event.target.innerHTML)
          } else if (event.target.nodeName == 'SPAN') {
              //console.log(window.getSelection())
              //console.log( event.target )
              if (window.getSelection().focusNode.parentNode.nodeName == 'TD') {
                  range.insertNode(span)
                  this.submitMarkup( item, event.target.innerHTML )
                  //console.log(window.getSelection().focusNode.parentNode.innerHTML)
              } else {
                  console.log( 'do NOT update' )
              }
          } else {
              console.log( 'do NOT update' )
          }
        } else {
          //console.log(event.target.nodeName)
          if (event.target.nodeName == 'TD') {
              if (range.endContainer === range.startContainer) { 
                //console.log(range.commonAncestorContainer)
                //span.textContent = range.extractContents().toString()
                range.surroundContents(span)
                this.submitMarkup( item, event.target.innerHTML )
              } else {
                  console.log('do NOT update')
              }
          } else {
              console.log( 'do NOT update' )
          }
        }
        
        // console.log( window.getSelection().toString() )
        // console.log( window.getSelection().getRangeAt(0).toString() )

// range.selectNodeContents(span)
        //console.log(range.surroundContents(span))
        // range.startContainer.innerHTML = span.innerText
        // console.log(range.startContainer.innerHTML)
        // console.log(range.endContainer.innerHTML)
        // console.log( window.getSelection() )
        // console.log( window.getSelection().anchorNode.innerHTML )
        // console.log(event.target.nodeName)
        console.log(event.target.innerHTML)

        /*
        const start = range.startOffset
        console.log(start)
        const end = range.endOffset
        console.log(end)
        let t1 = ''
        let t2 = ''
        let t3 = ''
        if (text === '') { // insert blanks ___
          t1 = text.substring(0, start - 1)
          t2 = ' ___ '
          t3 = text.substring(end - 1, text.length)
        } else { // add < > to selection
          t1 = text.substring(0, start - 1)
          t2 = ' <' + window.getSelection().toString() + '> '
          t3 = text.substring(end - 1, text.length)
        }
        console.log('t1: ', t1, 't2: ', t2, 't3 :', t3)
        */
      },
      submitMarkup(item, text) {
        this.$fireStore.collection('speech').doc(item.id)
          .update({ speech: text }).then(() => {
            console.log('update success')
          }).catch(error => {
            console.log(error)
          }) 
      },
      checkSpeech: function (item) {
        //console.log(item.id)
        if (item.correct) {
          this.$fireStore.collection('speech').doc(item.id)
            .update({ correct: null }).then(function () {
              console.log('success')
            }).catch(function (error) { console.log(error) })
        } else {
          this.$fireStore.collection('speech').doc(item.id)
            .update({ correct: true }).then(function () {
              console.log('success')
            }).catch(function (error) { console.log(error) })
        }
      },
      filterByName: function (name) {
        this.curStu = name
        //console.log('filtering ...', name)
        this.filtered = this.stuSpeech.filter(function (e) {
          //console.log(e)
          return (e.name === name)
        })
      },
      selectUnit(item) {
        //console.log(item.unit, item.unitid)
        this.selectedUnit = item.unit
        this.selectedUnitid = item.unitid
        this.mySpeech = []
        this.curStu = ''
        this.$fireStore.collection('speech').where('unitid', '==', this.selectedUnitid)
          .where('email', '==', this.user.email)
          .orderBy('time').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                // console.log(change.doc.data())
                // console.log(change.doc.id)
                this.mySpeech.push({ ...change.doc.data(), speechid: change.doc.id })
              }
              if (change.type === 'modified') {
                //console.log('Modified: ', change.doc.data())
                var pos = this.mySpeech.findIndex(x => x.speechid === change.doc.id)
                if (pos !== -1) {
                  this.mySpeech.splice(pos, 1, { ...change.doc.data(), speechid: change.doc.id })
                }
              }
              if (change.type === 'removed') {
                //console.log('Removed : ', change.doc.data())
              }
            })
          })
      },
      selectLesson(item) {
        //console.log(item)
        this.units = []
        this.selectedLesson = item.lesson
        this.selectedLessonid = item.lessonid
        this.selectedUnit = ''
        this.selectedUnitid = ''
        this.loading = true
        this.$fireStore.collection('units').where('lessonid', '==', this.selectedLessonid)
          .orderBy('unit').get().then(query => {
            query.forEach(doc => {
              this.units.push({ unit: doc.data().unit, unitid: doc.id })
            })
            this.loading = false
          }).catch(error => {
            console.log(error)
          })
      },
      selectClass(item) {
        //console.log(item.classid)
        this.lessons = []
        this.units = []
        this.selectedClassid = item.classid
        this.selectedClass = item.class
        this.selectedLesson = ''
        this.selectedLessonid = ''
        this.selectedUnit = ''
        this.selectedUnitid = ''
        this.loading = true
        this.$fireStore.collection('lessons').where('classid', '==', this.selectedClassid)
          .orderBy('lesson').get().then(query => {
            query.forEach(doc => {
              this.lessons.push({ lesson: doc.data().lesson, lessonid: doc.id })
            })
            this.loading = false
          }).catch(error => {
            console.log(error)
          })
      },
      submitSpeech () {
        const temp = { email: this.user.email, name: 'Teacher', unit: this.selectedUnit, audioPath: this.path,
                        unitid: this.selectedUnitid, speech: this.final_transcript, time: new Date() }
        // console.log(temp)
        this.$fireStore.collection('speech').add(temp).then(doc => {
          //console.log(doc.id)
          this.sentences = []
        }).catch(error => {
          console.log(error)
        })
      },
      deleteSpeech (speechid, index) {
        //console.log(speechid)
        this.$fireStore.collection('speech').doc(speechid).delete()
          .then(() => {
            console.log('delete success')
            this.mySpeech.splice(index, 1)
          }).catch(error => {
            console.log(error)
          })
      },
      startSpeechRecognition () {
        //console.log('recognizing ??? ', this.recognizing)
        if (this.recognizing) {
          this.recognition.stop()
          console.log('recognition STOPPED')
          this.mediaRecorder.stop();
        } else {
          this.final_transcript = ''
          this.recognition.start()
          this.ignore_onend = false
          // record audio
          this.mediaRecorder.start();
          console.log('start recording')
          this.audioChunks = [];
        }
      },
      addLesson(event) {
        // console.log(this.newLesson)
        if (event.which === 13 || event.keyCode === 13) {
          event.preventDefault()
          this.loading = true
          this.$fireStore.collection('lessons')
            .add({ lesson: this.newLesson, classid: this.selectedClassid, class: this.selectedClass, email: this.user.email })
            .then(data => {
              this.newLessonid = data.id
              this.lessons.push({ lesson: this.newLesson, lessonid: this.newLessonid })
              this.loading = false
            }).catch(error => {
              console.log(error)
            })
        }
      },
      addUnit(event) {
        //console.log(event)
        if (event.which === 13 || event.keyCode === 13) {
          event.preventDefault()
          this.$fireStore.collection('units')
            .add({ unit: this.newUnit, lesson: this.selectedLesson, lessonid: this.selectedLessonid, class: this.selectedClass, email: this.user.email })
            .then(data => {
              this.newUnitid = data.id
              this.units.push({ unit: this.newUnit, unitid: this.newUnitid })
              this.loading = false
            }).catch(error => {
              console.log(error)
            })
        }
      },
      getSpeech() {
        console.log('getting speech ...')
        this.stuArr = []
        this.stuSpeech = []
        this.filtered = []
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
        this.unsubscribe = this.$fireStore.collection('speech')
          .where('unitid', '==', this.selectedUnitid)
          .orderBy('time').onSnapshot(res => {
            //console.log(res.empty)
            if (res.empty) {
                this.sbcolor = 'info'
                this.sbtext = 'Info: No submitted speech'
                this.snackbar = true
            } else {
              res.docChanges().forEach(change => {
                // console.log(change.doc.data())
                if (change.type === 'added') {
                  if (!this.stuArr.includes(change.doc.data().name)) {
                    this.stuArr.push(change.doc.data().name)
                  }
                  this.stuSpeech.push({ ...change.doc.data(), id: change.doc.id })
                  //console.log(this.stuSpeech)
                  // if the added speech is from the current student, add it the filtered list
                  if (this.curStu === change.doc.data().name) {
                    this.filtered.push({ ...change.doc.data(), id: change.doc.id })
                  }
                } else if (change.type === 'removed') {
                  //console.log('removed : ', change.doc.data())
                  var pos = this.filtered.findIndex(x => x.id === change.doc.id)
                  if (pos !== -1) {
                    this.filtered.splice(pos, 1)
                  }
                  pos = this.stuSpeech.findIndex(x => x.id === change.doc.id)
                  if (pos !== -1) {
                    this.stuSpeech.splice(pos, 1)
                  }
                } else if (change.type === 'modified') {
                  //console.log('modified : ', change.doc.id, change.doc.data())
                  var i = this.filtered.findIndex(x => x.id === change.doc.id)
                  if (i !== -1) {
                    this.filtered.splice(i, 1, { ...change.doc.data(), id: change.doc.id })
                  }
                  i = this.stuSpeech.findIndex(x => x.id === change.doc.id)
                  if (i !== -1) {
                    this.stuSpeech.splice(i, 1, { ...change.doc.data(), id: change.doc.id })
                  }
                }
              })
            }
          })
      },
      initSpeech() {
        this.final_transcript = ''
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.addEventListener('start', event => {
          this.recognizing = true
        })
        this.recognition.onerror = function (event) {
          if (event.error === 'no-speech') {
            alert('No speech detected')
            this.ignore_onend = true
          }
          if (event.error === 'audio-capture') {
            alert('No audio detected')
            this.ignore_onend = true
          }
          if (event.error === 'not-allowed') {
            alert('Microphone access denied')
            this.ignore_onend = true
          }
        }
        this.recognition.addEventListener('speechend', event => {
          this.recognizing = false
        })
        this.recognition.addEventListener('end', () => {
          console.log('recognition result END')
          this.recognizing = false
        })
        this.recognition.addEventListener('result', event => {
          var interimTranscript = ''
          if (typeof (event.results) === 'undefined') {
            this.recognition.end = null
            this.recognition.stop()
            return
          }
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            // console.log('confidence : ', event.results[i][0].confidence)
            if (event.results[i][0].confidence > this.preConf) {
              this.preConf = event.results[i][0].confidence
              this.isFinal = event.results[i][0].transcript
              // console.log('transcript : ', event.results[i][0].transcript)
            }
            if (event.results[i].isFinal) {
              // console.log('isFinal : ', event.results[i][0].transcript)
              this.final_transcript += this.isFinal + ' '
              this.preConf = 0
              this.isFinal = ''
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }
          this.runtimeTranscription = interimTranscript
        })
      },
      init() {
        this.loading = true
        this.$fireStore.collection('classes').where('email', '==', this.user.email)
          .orderBy('class').get().then(query => {
            query.forEach(doc => {
              this.classes.push({ class: doc.data().class, classid: doc.id })
            })
            this.loading = false
          }).catch(error => {
            console.log(error)
          })
      },

    },
    computed: {
        user () {
            return this.$store.getters['getUser'];
        }
    },
    destroyed() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
    },
    mounted () {
      console.log( this.$fireStorage.ref() )
      if (!window.webkitSpeechRecognition) {
        alert('Please use Chrome browser for best compatibility')
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.lang = this.comboLangSelected.lang
        // ko-KR, ja-JP, cmn-Hans-CN, en-US
        // console.log(this.recognition)
        // console.log(window.document.getElementById('icons'))
        this.initSpeech()
      }
      this.init()

      // record audio
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {

          this.mediaRecorder = new MediaRecorder(stream)
          
          this.mediaRecorder.addEventListener("dataavailable", event => {
            this.audioChunks.push(event.data);
          })
          this.mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(this.audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play()
            this.path = this.$store.state.user.email + '/' + this.selectedClass + '/' + this.selectedLesson + '/' + this.selectedUnit + '/' + Date.now()
            //this.$fireStorage.ref().child(path)
            this.$fireStorage.ref().child(this.path).put(audioBlob).then(snapshot => {
              console.log('Uploaded a blob or file!');
              //console.log(snapshot.state) // 'success'
            })
          })

        })

    },
    asyncData({req, redirect}) {
        console.log(firebase.auth())
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
<style>
  #results {
    font-family: serif;
    font-size: 18px;
    font-weight: normal;
    border: 1px solid #ddd;
    padding: 15px;
    text-align: left;
    min-height: 150px;
  }
</style>