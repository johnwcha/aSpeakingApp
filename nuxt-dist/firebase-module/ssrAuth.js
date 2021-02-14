import admin from 'firebase-admin'

const config = {"apiKey":"AIzaSyA7Da7BtZw2LJOJa1zu-sgAzroS64a4fJs","authDomain":"ncacls.firebaseapp.com","databaseURL":"https:\u002F\u002Fncacls.firebaseio.com","projectId":"ncacls","storageBucket":"ncacls.appspot.com","messagingSenderId":"283590264790","appId":"1:283590264790:web:bda895561ffe7b86acc677","measurementId":"G-TBE9FQNQJD"}

const simulateUserRecord = ({
  uid,
  email,
  email_verified: emailVerified,
  name: displayName
}) => ({
  uid,
  email,
  emailVerified,
  displayName
})

if (!admin.apps.length) {
  admin.initializeApp(config)
}

export default async ({ req, res }) => {
  if (!req || !req.headers.authorization) {
    return
  }

  // Parse the injected ID token from the request header.
  const authorizationHeader = req.headers.authorization || ''
  const components = authorizationHeader.split(' ')
  const idToken = components.length > 1 ? components[1] : ''

  try {
    // Try to verify the id token, additionally checking if the token was revoked
    const decodedToken = await admin.auth().verifyIdToken(idToken)

    if (decodedToken.uid) {
      const authUser = simulateUserRecord(decodedToken)

      res.locals = {
        ...res.locals,
        user: {
          ...authUser,
					allClaims: decodedToken,
					idToken,
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}
