<template>
<div>
  <v-layout>
    <v-row class="text-center mt-5" justify="center" align="center" id="embedded_video">
    <v-col cols="12" >
      <v-row>
        <v-col cols="4"> <v-text-field placeholder="student email" v-model="email"></v-text-field>        </v-col>
        <v-col cols="4"> <v-text-field placeholder="exam name" v-model="exam"></v-text-field>        </v-col>
        <v-col cols="1"> <v-btn class="primary" @click="saveResult" :disabled="!email || !exam"> save </v-btn> </v-col>
        <v-col cols="3"> <v-btn class="success" :disabled="!email" @click="retrieve"> retrieve </v-btn> 
            <v-btn color="indigo" outlined :disabled="updateID==''" @click="update"> update </v-btn> 
        </v-col>
      </v-row>
      <v-row>
        <span v-for="(item, i) in updateArray"> <v-btn text large @click="showResult(item)"> {{item.exam}} </v-btn> </span>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea v-model="tainput" outlined @change="parseInput"></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col cols="2"> 聲調 </v-col>
            <v-col cols="3"> score: {{(tonePercent*100).toFixed(2)}} </v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="toneWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(tonePercent*toneWeight).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="2"> 發音 </v-col>
            <v-col cols="3"> score: {{(proPercent*100).toFixed(2)}} </v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="proWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(proPercent*proWeight).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="2"> 語法 </v-col>
            <v-col cols="3"> score: <input style="padding-left: 1px; width: 30px; text-align: left;" v-model="graPercent" type="text"></v-col>
            <v-col cols="3"> weight: <input style="padding-right: 1px; width: 24px; text-align: right;" v-model="graWeight" type="text">% </v-col>
            <v-col cols="2"> <span class="red--text"> {{(graPercent*graWeight/100).toFixed(2)}} </span> </v-col>
            <v-col cols="2"> Total: {{(scoreTotal).toFixed(2)}} </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div>
          <div style="display: inline-block; width: 160px; height: 110px" v-for="(item, i) in charArray" :key="i">
            <v-btn class="char" @click="speak(item.char)" outlined style="padding: 2px; min-width: 72px; min-height: 72px"> 
                 {{item.char}} </v-btn>
            <div style="height:24px">
                <v-chip class="ma-2" :text-color="(item.sheng>=0 ? 'black' : 'white')" v-if="item.sheng!=0"
                        :color="(item.sheng>=0 ? 'white' : 'red')" @click="flagSheng(item)"> 声 </v-chip>
                
                <input style="width: 64px; text-align: center;" v-model="item.pinyin" type="text">
                <v-chip class="ma-2" :text-color="(item.yin>=0 ? 'black' : 'white')" v-if="item.yin!=0"
                        :color="(item.yin>=0 ? 'white' : 'orange')" @click="flagYin(item)"> 音 </v-chip>
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
    tainput: '',
    charArray: [],
    updateArray: [],
    updateID: '',
    sbtimeout: 0,
    sbcolor: 'info',
    sbtext: '',
    snackbar: false,
  }),
  computed: {
    scoreTotal: function() {
      return this.tonePercent*this.toneWeight + this.proPercent*this.proWeight + this.graPercent*this.graWeight/100
    }
  },
  methods: {
    showResult(item) {
      console.log(item)
      this.updateID = item.id
      this.charArray = item.charArray
      this.tonePercent = item.tonePercent
      this.toneWeight = item.toneWeight
      this.proPercent = item.proPercent
      this.proWeight = item.proWeight
      this.graPercent = item.graPercent
      this.graWeight = item.graWeight
      this.exam = item.exam
    },
    retrieve() {
      this.$fireStore.collection("-oralexam").where("email", "==", this.email).get()
        .then(snapshot => {
        if (snapshot.empty) {
            this.sbtimeout = 6000
            this.sbcolor = 'warning'
            this.sbtext = 'no data'
            this.snackbar = true
        } else {
            snapshot.forEach(doc => {
            console.log(doc.data())
            this.updateArray.push({id: doc.id, ...doc.data()})
            })
        }
        }).catch(error => { console.error(error.message)})
    },
    update() {
      if (this.updateID!='') {
        const obj = { email: this.email, exam: this.exam, charArray: this.charArray, 
                    tonePercent: this.tonePercent, toneWeight: this.toneWeight,
                    proPercent: this.proPercent, proWeight: this.proWeight, 
                    graPercent: this.graPercent, graWeight: this.graWeight, scoreTotal: this.scoreTotal}
        this.$fireStore.collection('-oralexam').doc(this.updateID).set(obj).then(() => {
            this.sbtimeout = 6000
            this.sbcolor = 'success'
            this.sbtext = 'update success'
            this.snackbar = true
        }).catch(error => { console.log(error.message)})
      }
    },
    speak(char) {
      //console.log(this.voice)
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
    saveResult() {
      const obj = { email: this.email, exam: this.exam, charArray: this.charArray, 
                    tonePercent: this.tonePercent, toneWeight: this.toneWeight,
                    proPercent: this.proPercent, proWeight: this.proWeight, 
                    graPercent: this.graPercent, graWeight: this.graWeight, scoreTotal: this.scoreTotal}
      console.log(obj)
      this.$fireStore.collection('-oralexam').add(obj).then(docRef => {
        this.sbtimeout = 6000
        this.sbcolor = 'success'
        this.sbtext = 'data save success'
        this.snackbar = true
      }).catch(error => { console.log(error.message)})
    },
    flagSheng(item) {
      item.sheng *= -1
      this.recalc()
    },
    flagYin(item) {
      item.yin *= -1
      this.recalc()
    },
    recalc() {
      let totalChar = 0
      let toneCorrect = 0
      let proCorrect = 0
      this.charArray.forEach(item => {
        if (item.sheng != 0) {
          totalChar += 1
          if (item.sheng==1) toneCorrect += 1
          if (item.yin==1) proCorrect += 1
        }
      })
      this.tonePercent = toneCorrect/totalChar
      this.proPercent = proCorrect/totalChar
      console.log('shengdiao:', toneCorrect/totalChar)
      console.log('fayin:', proCorrect/totalChar)
    },
    parseInput(){
      //let temp = this.tainput.split('\n').join('').split(' ')
      this.charArray = getPinyin(this.tainput.split(' ').join('').split(''))
      console.log(this.charArray)
    },
  },
  mounted () {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
      this.voice = this.synthesis.getVoices().filter(voice => {
        //console.log(voice)
        return voice.lang == 'zh-CN'
      })[1]
      //console.log(this.voice)
    } else {
      console.log('Text-to-speech not supported.')
    }
  },
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