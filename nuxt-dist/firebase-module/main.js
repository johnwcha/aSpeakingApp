import * as firebase from 'firebase/app'

const config = {"apiKey":"AIzaSyA7Da7BtZw2LJOJa1zu-sgAzroS64a4fJs","authDomain":"ncacls.firebaseapp.com","databaseURL":"https:\u002F\u002Fncacls.firebaseio.com","projectId":"ncacls","storageBucket":"ncacls.appspot.com","messagingSenderId":"283590264790","appId":"1:283590264790:web:bda895561ffe7b86acc677","measurementId":"G-TBE9FQNQJD"}

export default async ({ res }, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  const session = firebase.apps[0]

  /** --------------------------------------------------------------------------------------------- **/
  /** -------------------------------------- FIREBASE AUTH ---------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  await import('firebase/auth')

  const fireAuth = session.auth()
  const fireAuthObj = firebase.auth
  inject('fireAuth', fireAuth)
  inject('fireAuthObj', fireAuthObj)

  // persistence should only be enabled client side
  if (process.client) {
    const persistence = firebase.auth.Auth.Persistence.LOCAL

    try {
      await fireAuth.setPersistence(persistence)
    } catch (err) {
      if (err.code === 'auth/invalid-persistence-type') {
        console.warn(`[@nuxtjs/firebase]: Invalid persistence type '${persistence}' provided`)
      } else if (err.code === 'auth/unsupported-persistence-type') {
        console.warn(`[@nuxtjs/firebase]: Persistence type '${persistence}' is not supported in this environment.`)
      }
    }
  }

  /** --------------------------------------------------------------------------------------------- **/
  /** ------------------------------------- FIREBASE FIRESTORE ------------------------------------ **/
  /** --------------------------------------------------------------------------------------------- **/

  await import('firebase/firestore')

  const fireStore = session.firestore()
  const fireStoreObj = firebase.firestore
  inject('fireStore', fireStore)
  inject('fireStoreObj', fireStoreObj)

  /** --------------------------------------------------------------------------------------------- **/
  /** ----------------------------------- FIREBASE ANALYTICS -------------------------------------- **/
  /** --------------------------------------------------------------------------------------------- **/

  // Firebase Analytics can only be initiated on the client side
  if (process.client) {
    await import('firebase/analytics')

    const fireAnalytics = session.analytics()
    const fireAnalyticsObj = firebase.analytics
    inject('fireAnalytics', fireAnalytics)
    inject('fireAnalyticsObj', fireAnalyticsObj)
  }
}
