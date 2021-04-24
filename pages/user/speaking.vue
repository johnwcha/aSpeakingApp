<template>
  <v-container id="icons" fluid tag="section">
    <v-row v-if="speakMode!='quiz'">
      <v-col cols="12">
        <v-card >

    <v-app-bar dark color="pink lighten-1 py-1">
      <v-toolbar-title> Speaking Exercises </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-radio-group row v-model="char" class="mt-5">
          <v-radio label="Traditional" value="trad"></v-radio>
          <v-radio label="Simplified" value="simp"></v-radio>
      </v-radio-group>
    </v-app-bar>

            <v-row class="ml-3">
              <v-col cols="4">
              <v-combobox v-model="comboClassSelected" :items="comboClass" item-text="course" 
                item-value="courseid" dense label="Select class" @change="selectClass('speak')"
              ></v-combobox>
              </v-col>
              <v-col cols="4">
              <v-combobox v-model="comboLessonSelected" :items="comboLesson" item-text="lesson"
                item-value="lessonid" dense label="Select lesson" @change="selectLesson"
              ></v-combobox>
              </v-col>
              <v-col cols="4">
              <v-combobox
                v-model="comboUnitSelected"
                :items="comboUnit"
                item-text="unit"
                item-value="unitid"
                dense
                label="Select unit"
                @change="selectUnit"
              ></v-combobox>

              </v-col>
            </v-row>

<v-divider></v-divider>

          <v-row>
            <v-col cols="8">
              <v-simple-table>
                <thead>
                  <tr>
                    <th style="font-size: 18px" class="blue--text">
                      #
                    </th>
                    <th style="font-size: 18px" class="blue--text">
                      Speech
                    </th>
                    <th style="font-size: 18px" class="blue--text">
                      @
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in mySpeech" :key="item.speechid">
                    <td> {{ i+1 }} </td>
                    <td style="font-size: 18px" v-html="item.speech"> </td>
                    <td> 
                      <v-icon @click="playAudio(item.audioPath)"> mdi-play-circle </v-icon>
                      /
                      <v-icon @click="deleteSpeech(item.speechid, i)"> mdi-delete </v-icon>
                      <span v-if="item.correct"> /
                      <v-icon class="green--text" > mdi-check-bold </v-icon> </span>
                      <span> {{ dayjs.unix(item.time.seconds).format('h:mm:ss A • MMM D') }} </span>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

                  <v-card v-if="charArray.length>0" class="mt-2">
                      <div style="display: inline-block; width: 100px; height: 110px" v-for="(item, i) in charArray" :key="i">
                        <v-btn class="char" outlined style="padding: 2px; min-width: 72px; min-height: 72px"> 
                            {{item.char}} </v-btn>
                        <div style="height:24px">
                            <v-chip :text-color="(item.sheng>=0 ? 'black' : 'white')" v-if="item.sheng!=0"
                                    :color="(item.sheng>=0 ? 'white' : 'red')"> 声 </v-chip>
                            
                            <!-- <input style="width: 64px; text-align: center;" v-model="item.pinyin" type="text"> -->
                            <v-chip :text-color="(item.yin>=0 ? 'black' : 'white')" v-if="item.yin!=0"
                                    :color="(item.yin>=0 ? 'white' : 'orange')"> 音 </v-chip>
                        </div>
                      </div>
                    <v-simple-table>
                      <tbody>
                        <tr>
                          <td> 聲調 </td>
                          <td> <v-text-field label="score:" v-model="toneScore" />  </td>
                          <td> <v-text-field label="weight:" suffix="%" v-model="toneWeight" />  </td>
                          <td> <v-text-field label="subtotal:" v-model="toneSubtotal" /> </td>
                        </tr>
                        <tr>
                          <td> 發音 </td>
                          <td> <v-text-field label="score:" v-model="proScore" /> </td>
                          <td> <v-text-field label="weight:" suffix="%" v-model="proWeight"/>  </td>
                          <td> <v-text-field label="subtotal:" v-model="proSubtotal" /> </td>
                        </tr>
                        <tr>
                          <td> 語法 </td>
                          <td> <v-text-field label="score:" v-model="graScore" /> </td>
                          <td> <v-text-field label="weight:" suffix="%" v-model="graWeight" />  </td>
                          <td> <v-text-field label="subtotal:" v-model="graSubtotal" /> </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <v-card-actions> <v-spacer />
                      <v-card-title> Total: {{scoreTotal}} </v-card-title></v-card-actions>
                  </v-card>

            </v-col>
            <v-col cols="4">
              <div id="results" v-if="char=='simp'">
                <span class="purple--text"> {{ final_transcript }} </span>
                <span class="green--text">{{runtimeTranscription}}</span>
              </div>
              <div id="results_trad" v-if="char=='trad'">
                <span class="purple--text"> {{ final_transcript_trad }} </span>
                <span class="green--text">{{ runtimeTranscription_trad }}</span>
              </div>
              <div id="div_start_" class="mt-5">
                <v-row align="center" justify="center">
                  <a v-if="!recognizing"><img @click="startSpeechRecognition" src="../../static/mic.gif"></a>
                  <a v-if="recognizing"><img @click="startSpeechRecognition" src="../../static/mic-animate.gif"></a>
                  <!-- <v-btn dark @click="startSpeechRecognition" icon :color="!recognizing ? 'grey' : 'red darken-3'"
                    :class="{'animated infinite pulse': recognizing}">
                    <v-icon large>{{recognizing ? 'mdi-microphone-off' : 'mdi-microphone'}}</v-icon>
                  </v-btn> -->
                  <v-btn dark color="blue lighten-1" :disabled="recognizing" @click="submitSpeech"> Submit </v-btn>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

<!-- QUIZ -->
<div v-if="speakMode!='speak'">
    <v-app-bar dark color="green lighten-1 py-1">
      <v-toolbar-title> Vocab Quizzes </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-radio-group row v-model="char" class="mt-5">
          <v-radio label="Traditional" value="trad"></v-radio>
          <v-radio label="Simplified" value="simp"></v-radio>
      </v-radio-group>
    </v-app-bar>

      <v-row class="ml-3">
        <v-col cols="4">
        <v-combobox v-model="comboClassSelected" :items="comboClass" item-text="course"
          item-value="courseid" dense label="Select class" @change="selectClass('quiz')"
        ></v-combobox>
        </v-col>
        <v-col cols="4">
        <v-combobox v-model="comboQuizSelected" :items="comboQuiz" item-text="unit"
            dense label="Select quiz" @change="selectQuiz" return-object
        ></v-combobox>
        </v-col>
        <v-col cols="4"> 
          <v-btn @click="startQuiz" small class="warning" :disabled="comboQuizSelected==null"> start </v-btn>
          <v-btn @click="showQuizResult" small color="yellow" :disabled="!hasPrevQuiz"> performance </v-btn>
        </v-col>
      </v-row>

  <div v-if="quizMode=='started'">
    <v-container><v-row align="center" justify="center" > <!-- English -->
      <span class="display-1"> {{quizQues[curQuizNum]['eng']}}  </span>
    </v-row></v-container>

    <v-row align="center" justify="center" > <!-- Character Question -->
      <div id="resultsx" v-if="char=='simp'">
        <span class="purple--text"> {{ final_transcript }} </span>
        <span class="green--text">{{runtimeTranscription}}</span>
      </div>
      <div id="results_tradx" v-if="char=='trad'">
        <span class="purple--text"> {{ final_transcript_trad }} </span>
        <span class="green--text">{{ runtimeTranscription_trad }}</span>
      </div>
      <span v-if="quizQues[curQuizNum]['cor']==1"> <v-icon class="green--text display-1"> mdi-check-bold </v-icon></span>
    </v-row>

    <v-row  align="center" justify="center" > <!-- Controls -->
      <span class="display-1 mr-5"> {{ curQuizNum+1 }} of {{ quizQues.length }} </span>
      <v-btn fab dark small color="cyan" @click="goNext"> <v-icon dark> mdi-chevron-right </v-icon> </v-btn>
      <a v-if="!recognizing"><img @click="startSpeechRecognition" src="../../static/mic.gif"></a>
      <a v-if="recognizing"><img @click="startSpeechRecognition" src="../../static/mic-animate.gif"></a>
    </v-row>

    <v-row align="center" justify="center" v-if="showResult" > <!-- Time -->
      <span class="display-1"> 
        {{quizCorrect}} of {{quizQues.length}} correct ({{(quizCorrect/quizQues.length*100).toFixed(1)}}%) in {{endTime}} seconds
      </span>
    </v-row>
  </div>

    <v-divider></v-divider>

    <div v-if="quizMode=='performance'">                      <!-- Performance -->
      <v-row>
        <v-col cols="12">
          <v-simple-table>
            <thead>
              <tr>
                <th style="font-size: 18px" class="blue--text">
                  #
                </th>
                <th style="font-size: 18px" class="blue--text">
                  <v-icon> mdi-percent </v-icon>
                </th>
                <th style="font-size: 18px" class="blue--text">
                  <v-icon> mdi-clock-outline </v-icon>
                </th>
                <th style="font-size: 18px" class="blue--text">
                  <v-icon> mdi-calendar-range </v-icon>
                </th>
                <th>
                  
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in quizStats" :key="i">
                <td> {{ i+1 }} </td>
                <td style="font-size: 18px"> {{item.percentage}} </td>
                <td style="font-size: 18px"> {{item.duration}} </td>
                <td> {{
                  new Date(item.time*1000).getMonth()+1}}/{{new Date(item.time*1000).getDate()}}, 
                  {{new Date(item.time*1000).toLocaleTimeString()}} </td>
                <td> <span v-for="(res, n) in item.response" :key="n">
                  {{ n+1 }} <span v-if="char=='simp'">({{res.simp}})</span> <span v-if="char=='trad'">({{res.trad}})</span>
                  : 
                  <span v-if="res.cor==1 && res.userInput.length==1">
                    <v-icon class="green--text"> mdi-check-bold </v-icon> </span>
                  <span v-else-if="res.cor==1">
                    <v-icon class="pink--text"> mdi-check </v-icon>
                    <span v-for="(ans, j) in res.userInput" :key="j"> {{ans.ans}} || </span> </span>
                  <span v-else>
                    <v-icon class="red--text"> mdi-close </v-icon>
                    <span v-for="(ans, k) in res.userInput" :key="k"> {{ans.ans}} || </span> </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </div>

</div>
<!-- QUIZ END -->

<v-snackbar v-model="snackbar" :color="sbcolor" bottom :timeout="sbtimeout">
    {{ sbtext }}
    <template>
        <v-btn dark text @click="snackbar = false">
          Close
        </v-btn>
    </template>
</v-snackbar>

  </v-container>
</template>

<script>
import { getUserFromCookie, shuffle } from '@/helper'
// import * as dayjs from 'dayjs'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-storage'
// import conv from 'zh_cn_zh_tw'
import OpenCC from 'opencc-js'

//import { mapGetters } from 'vuex'
  //import { traditionalize } from '../../../../src/convert'

  export default {
    data: () => ({
      toneWeight: 50,
      toneScore: 0,
      toneSubtotal: 0,
      graWeight: 25,
      graScore: 100,
      graSubtotal: 0,
      proWeight: 25,
      proScore: 0,
      proSubtotal: 0,
      scoreTotal: 0,
      charArray: [],
      audio: null,
      path: '',
      mediaRecorder: null,
      audioChunks : [],
        sbtimeout: 0,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
        char: 'simp',
      recognition: null,
      recognizing: null,
      error: false,
      sentences: [],
      comboClass: null,
      comboClassSelected: null,
      comboLesson: null,
      comboLessonSelected: null,
      comboUnit: null,
      comboUnitSelected: null,
      comboQuiz: [],
      comboQuizSelected: null,
      speakMode: '',
      hasPrevQuiz: false,
      resultDiv: false,
      quizMode: '',
      quizQues: [],
      curQuizNum: 0,
      startTime: null,
      endTime: null,
      showResult: false,
      quizCorrect: 0,
      quizStats: [],
      mySpeech: [],
      preConf: 0,
      isFinal: '',
      final_transcript: '',
      runtimeTranscription: '',
      final_transcript_trad: '',
      runtimeTranscription_trad: '',
      ignore_onend: false,
      comboLangSelected: { language: 'Chinese', lang: 'cmn-Hans-CN' },
      //comboLang: [{ language: 'Chinese', lang: 'cmn-Hans-CN' }, { language: 'English', lang: 'en-US' }, { language: 'Japanese', lang: 'ja-JP' }, { language: 'Korean', lang: 'ko-KR' }, { language: 'Italian', lang: 'it-IT' }, { language: 'French', lang: 'fr-FR' }, { language: 'Spanish', lang: 'es-MX' }],
    }),
    computed: {
      user () {
        return this.$store.getters['getUser'];
      },
      enrolled() {
        return this.$store.getters['getEnrolled'];
      },
      dayjs() {
        return require('dayjs');
      }
    },
    mounted() {
    if (!window.webkitSpeechRecognition) {
        alert('Please use Chrome browser for best compatibility')
      } else {
        const SpeechRecognition = window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.lang = this.comboLangSelected.lang
        // ko-KR, ja-JP, cmn-Hans-CN, en-US
        // console.log(this.recognition)
        // console.log(window.document.getElementById('icons'))
        this.init()
        // record audio init
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.addEventListener("dataavailable", event => {
              this.audioChunks.push(event.data);
            })
            this.mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(this.audioChunks);
                //const audioUrl = URL.createObjectURL(audioBlob);
                //const audio = new Audio(audioUrl);
                //audio.play()
                // console.log(this.comboClassSelected)
                // console.log(this.comboLessonSelected)
                // console.log(this.comboUnitSelected)
              if (this.speakMode=='speak') { 
                this.path = this.$store.state.user.email + '/' + this.comboClassSelected.course + '/' + this.comboLessonSelected.lesson + '/' + this.comboUnitSelected.unit + '/' + Date.now()
                //this.$fireStorage.ref().child(path)
                this.$fireStorage.ref().child(this.path).put(audioBlob).then(snapshot => {
                  console.log('Uploaded a blob or file!');
                  //console.log(snapshot.state) // 'success'
                })
              }
            })
          })
      }
      // console.log(this.$store.state.user.data.enrolled)
      this.comboClass = []
      //const temp = this.$store.state.user.data.enrolled
      this.$fireStore.collection('users').doc(this.user.email).get().then(query => {
          //console.log(query.data())
          let temp = query.data().enrolled
            temp.forEach(classid => {
              //console.log(classid)
                this.$fireStore.collection('classes').doc(classid).get()
                .then(doc => {
                    this.comboClass.push({ courseid: classid, course: doc.data().class })
                    // console.log(doc.data().class)
                }).catch(error => {
                    // console.log(error)
                    alert('Error connecting to database in init', error)
                })
            })
      }).catch(error => {
          console.log(error)
      })
    },
    methods: {
      showQuizResult(){
        this.quizMode = 'performance'
        this.resultDiv = true
        this.quizStats = []
        this.$fireStore.collection('vocab_quiz_stats').where('email', '==', this.user.email)
        .where('unitid', '==', this.comboQuizSelected.qid).orderBy('time').get().then(doc =>{
          doc.forEach(item =>{
            this.quizStats.push({...item.data()})
          })
        }).catch(error =>{ console.log(error.message)})
      },
      startQuiz(){
        this.quizCorrect = 0
        this.showResult = false
        this.quizMode='started'
        this.startTime = Date.now()
      },
      goNext() {
        if (this.curQuizNum==this.quizQues.length-1) {
          // stop time & calculate
          //this.endTime = ((Date.now() - this.startTime)/1000).toFixed(1)
        } else {
          this.curQuizNum += 1
          //console.log(this.curQuizNum)
          this.final_transcript = ''
          this.final_transcript_trad = ''
        }
      },
      playAudio(path) {
        // console.log( path )
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
      onResult (data) {
        console.log(window.URL.createObjectURL(data))
      },
      selectLang (item) {
        console.log('simplified convert')
        //console.log(item)
        this.recognition.lang = this.comboLangSelected.lang
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
      submitSpeech () {
        if (!this.comboUnitSelected) {
            this.sbcolor = 'info'
            this.sbtext = "Info: Select 'class' 'lesson' 'unit' to begin"
            this.snackbar = true
            return;
        }
        console.log(this.path)
        var speech = this.char=='trad' ? this.final_transcript_trad : this.final_transcript
        const temp = { email: this.user.email, name: this.user.displayName, audioPath: this.path,
            unit: this.comboUnitSelected.unit, unitid: this.comboUnitSelected.unitid, speech: speech, time: new Date() }
        this.$fireStore.collection('speech').add(temp).then(doc => {
          //console.log(doc.id)
          this.sentences = []
        }).catch(error => {
          console.log(error)
        })
      },
      selectQuiz () {
        console.log(this.comboQuizSelected)
        this.hasPrevQuiz = false
        var temp = []
        this.comboQuizSelected.que.forEach(item => {
          if (item.char.split('--').length==2) {
            temp.push({userInput:[], cor:0, eng:item.eng, trad:item.char.split('--')[0], simp:item.char.split('--')[1]})
          } else {
            temp.push({userInput:[], cor:0, eng:item.eng, trad:item.char, simp:item.char})
          }
        })
        this.quizQues = shuffle(temp)
        this.curQuizNum = 0
        // check if previous result
        this.$fireStore.collection('vocab_quiz_stats').where('email', '==', this.user.email)
        .where('unitid', '==', this.comboQuizSelected.qid).orderBy('time').get().then(doc =>{
          console.log(doc)
          if (!doc.empty) {
            this.hasPrevQuiz = true
          }
        }).catch(error =>{ console.log(error.message)})
      },
      selectUnit () {
        // get submitted speeches
        this.mySpeech = []
        this.$fireStore.collection('speech').where('unitid', '==', this.comboUnitSelected.unitid)
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
        console.log(this.mySpeech)
        this.checkOralexam()
      },
      checkOralexam(){
        // console.log(this.comboUnitSelected)
        // console.log(this.user)
        this.$fireStore.collection('oralexam_inunits').doc(this.comboUnitSelected.unitid+'_'+this.user.email).get().then(res => {
          // console.log(res)
          if (res.exists) {
            // console.log(res.data())
            this.charArray = res.data().charArray
            this.graScore = res.data().graScore
            this.graSubtotal = res.data().graSubtotal
            this.graWeight = res.data().graWeight

            this.proScore = res.data().proScore
            this.proSubtotal = res.data().proSubtotal
            this.proWeight = res.data().proWeight

            this.toneScore = res.data().toneScore
            this.toneSubtotal = res.data().toneSubtotal
            this.toneWeight = res.data().toneWeight

            this.scoreTotal = res.data().scoreTotal
          } else {
            this.charArray = []
          }
        })
      },
      selectLesson () {
        //console.log(this.comboLessonSelected)
        this.comboUnit = []
        this.comboUnitSelected = null
        this.$fireStore.collection('units').where('lessonid', '==', this.comboLessonSelected.lessonid)
          .orderBy('unit').get().then(query => {
            query.forEach(doc => {
              this.comboUnit.push({ unitid: doc.id, unit: doc.data().unit })
            })
          }).catch(error => {
            console.log(error)
          })
      },
      selectClass(type) {
        console.log(this.comboClassSelected.courseid)
        this.comboLesson = []
        this.comboLessonSelected = null
        this.comboUnit = []
        this.comboUnitSelected = null
        this.comboQuiz = []
        if (type=='quiz') {
          this.speakMode = 'quiz'
          console.log('for quiz')
          this.$fireStore.collection('vocab_units').where('uid', '==', this.comboClassSelected.courseid)
            .orderBy('unit').get().then(query => {
              query.forEach(doc => {
                console.log(doc.id, doc.data())
                this.comboQuiz.push({ qid: doc.id, ...doc.data() })
              })
            }).catch(error => { console.log(error.message) })
        } else {
          this.speakMode = 'speak'
          this.$fireStore.collection('lessons').where('classid', '==', this.comboClassSelected.courseid)
            .orderBy('lesson').get().then(query => {
              query.forEach(doc => {
                this.comboLesson.push({ lessonid: doc.id, lesson: doc.data().lesson })
              })
            }).catch(error => { console.log(error.message) })
        }
      },
      startSpeechRecognition () {
        //console.log('recognizing ??? ', this.recognizing)
        if (this.recognizing) {
          this.recognition.stop()
          console.log('recognition STOPPED')
          this.mediaRecorder.stop();
        } else {
          this.final_transcript = ''
          this.final_transcript_trad = ''
          this.recognition.start()
          this.ignore_onend = false
          // record audio
          this.mediaRecorder.start()
          console.log('start recording')
          this.audioChunks = []
        }
      },
      init: function () {
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
              this.isFinal = '';
              (async () => {
                const convert = await OpenCC.Converter('cn', 'tw')
                this.final_transcript_trad = convert(this.final_transcript)
              })()
              if (this.speakMode=='quiz') {
                this.startSpeechRecognition()
                //console.log('checking result ...')
                //console.log(this.quizQues[this.curQuizNum]['simp'], this.quizQues[this.curQuizNum]['simp'].length)
                //console.log(this.final_transcript, this.final_transcript.length)
                if (this.quizQues[this.curQuizNum]['simp']===this.final_transcript.trim()) {
                  //console.assert('correct')
                  this.quizQues[this.curQuizNum]['cor'] = 1
                } else if (this.final_transcript.trim().indexOf(this.quizQues[this.curQuizNum]['simp'])!=-1) {
                  this.quizQues[this.curQuizNum]['cor'] = 1
                } else {

                }
                this.quizQues[this.curQuizNum]['userInput'].push({ans:this.final_transcript.trim(), conf:event.results[i][0].confidence})
                // if last question
                if (this.curQuizNum==this.quizQues.length-1) {
                  // stop time & calculate
                  this.endTime = ((Date.now() - this.startTime)/1000).toFixed(1)
                  this.showResult = true
                  this.quizCorrect = 0
                  this.quizQues.forEach(item =>{
                    this.quizCorrect += item.cor
                  })
                  console.log(this.quizQues)
                  this.quizSave()
                }
              }
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }
          this.runtimeTranscription = interimTranscript;
            (async () => {
              const convert = await OpenCC.Converter('cn', 'tw')
              this.runtimeTranscription_trad = convert(this.runtimeTranscription)
            })()
        })
      },
      quizSave(){
        var obj = {time: firebase.firestore.FieldValue.serverTimestamp(), 
                  email: this.user.email, unit: this.comboQuizSelected.unit, 
                  unitid: this.comboQuizSelected.qid, 
                  percentage: (this.quizCorrect/this.quizQues.length*100).toFixed(1), 
                  duration: this.endTime, response: this.quizQues};
        console.log(obj)
        this.$fireStore.collection('vocab_quiz_stats').add(obj).then(doc =>{
            console.log('success: ', doc.id);
        }).catch(function(error){ console.log(error); })
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
<style>
  .char.v-btn.v-size--default {
      font-size: 3rem;
      font-family: SimSun;
  }
  #results, #results_trad {
    font-family: serif;
    font-size: 18px;
    font-weight: normal;
    border: 1px solid #ddd;
    padding: 15px;
    text-align: left;
    min-height: 150px;
  }
  #resultsx, #results_tradx {
    font-family: SimSun;
    font-size: 64px;
    font-weight: normal;
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center;
    min-height: 150px;
    width: 500px;
  }
</style>