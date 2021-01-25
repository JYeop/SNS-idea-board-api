import * as adminSdk from 'firebase-admin'
const serviceAccount = require('../serviceAccountKey.json')

adminSdk.initializeApp({
  credential: adminSdk.credential.cert(serviceAccount),
  databaseURL: 'https://cartech-e1b12.firebaseio.com'
})

const admin = adminSdk
const db = admin.firestore()
const auth = admin.auth()
const incrementValue = (value: number) => admin.firestore.FieldValue.increment(value)

export { db, auth, admin, incrementValue }
