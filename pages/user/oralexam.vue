<template>
<div>
  <v-layout>
    <v-row class="text-center mt-5" justify="center" align="center" id="embedded_video">
    <v-col cols="12" >
      <v-row>
        <span v-for="(item, i) in charArray"> <v-btn text large @click="showResult(item)"> {{item.exam}} </v-btn> </span>
      </v-row>
      <v-row v-if="dataArray.length>0">
        <v-col cols="12">
          <v-row>
            <v-col cols="2"> 聲調 (Tones) </v-col>
            <v-col cols="3"> score: {{(tonePercent*100).toFixed(2)}} </v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="toneWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(tonePercent*toneWeight).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="2"> 發音 (Pronunciation) </v-col>
            <v-col cols="3"> score: {{(proPercent*100).toFixed(2)}} </v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="proWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(proPercent*proWeight).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="2"> 語法 (Grammar) </v-col>
            <v-col cols="3"> score: <input style="padding-left: 1px; width: 30px; text-align: left;" v-model="graPercent" type="text"></v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="graWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(graPercent*graWeight/100).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> Total: {{(scoreTotal).toFixed(2)}} </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div>
          <div style="display: inline-block; width: 160px; height: 110px" v-for="(item, i) in dataArray" :key="i">
            <v-btn class="char" @click="speak(item.char)" outlined style="padding: 2px; min-width: 72px; min-height: 72px"> 
                 {{item.char}} </v-btn>
            <div style="height:24px">
                <v-chip class="ma-2" :text-color="(item.sheng>=0 ? 'black' : 'white')" v-if="item.sheng!=0"
                        :color="(item.sheng>=0 ? 'white' : 'red')"> 声 </v-chip>
                
                <span style="width: 64px; text-align: center;"> {{item.pinyin}} </span>
                <v-chip class="ma-2" :text-color="(item.yin>=0 ? 'black' : 'white')" v-if="item.yin!=0"
                        :color="(item.yin>=0 ? 'white' : 'orange')"> 音 </v-chip>
            </div>
          </div>
      </div>
    </v-col>
    </v-row>
  </v-layout>

<v-snackbar v-model="snackbar" :color="sbcolor" bottom :timeout="sbtimeout">
    {{ sbtext }}
    <template>
        <v-btn dark text @click="snackbar = false">
          Close
        </v-btn>
    </template>
</v-snackbar>


</div>  
</template>

<script>
import { getPinyin } from '../../helper/chtpwtdb'
import { getUserFromCookie } from '@/helper'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data: () => ({
    synthesis: null,
    voice: null,
    email: null,
    exam: null,
    graPercent: 0,
    toneWeight: 40,
    proWeight: 30,
    graWeight: 30,
    tonePercent: 0,
    proPercent: 0,
    charArray: [],
    dataArray: [],
    sbtimeout: 0,
    sbcolor: 'info',
    sbtext: '',
    snackbar: false,
  }),
  methods: {
    speak(char) {
      console.log(this.voice)
      if (!this.voice) {
        this.synthesis = window.speechSynthesis
        this.voice = this.synthesis.getVoices().filter(voice => {
            console.log(voice)
            return voice.lang === 'zh-CN'
        })[1]
      }
      // Create an utterance object
      var utterance = new SpeechSynthesisUtterance(char);

      // Set utterance properties
      utterance.voice = this.voice;
      utterance.pitch = 1;
      utterance.rate = 0.6;
      utterance.volume = 1.0;

      // Speak the utterance
      this.synthesis.speak(utterance);
    },
    showResult(item) {
      this.dataArray = item.charArray
      this.tonePercent = item.tonePercent
      this.toneWeight = item.toneWeight
      this.proPercent = item.proPercent
      this.proWeight = item.proWeight
      this.graPercent = item.graPercent
      this.graWeight = item.graWeight
      this.scoreTotal = item.scoreTotal
    },
  },
  mounted () {
      this.synthesis = window.speechSynthesis
      this.voice = this.synthesis.getVoices().filter(voice => {
        console.log(voice)
        return voice.lang === 'zh-CN'
      })[1]

    // if ('speechSynthesis' in window) {
    //   //console.log(voice)
    // } else {
    //   console.log('Text-to-speech not supported.')
    // }
    console.log(this.$fireAuth.currentUser.email)
    this.$fireStore.collection("-oralexam").where("email", "==", this.$fireAuth.currentUser.email).get()
    .then(snapshot => {
      //console.log(snapshot)
      if (snapshot.empty) {
        this.sbtimeout = 6000
        this.sbcolor = 'warning'
        this.sbtext = 'no data'
        this.snackbar = true
      } else {
        snapshot.forEach(doc => {
          console.log(doc.data())
          this.charArray.push(doc.data())
        })
      }
    }).catch(error => { console.error(error.message)})

  },
  asyncData({req, redirect}) {
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
.char.v-btn.v-size--default {
    font-size: 3rem;
    font-family: SimSun;
}
.v-chip.v-size--default {
    border-radius: 4px;
    font-size: 16px;
    height: 24px;
}
.v-application .ma-2 {
    margin: 0px !important;
}
</style>