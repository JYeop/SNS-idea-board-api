import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const makeUserDoc = async (ctx: IContext, next: Next) => {
  const payload: { displayName?: string; email?: string; profileImage?: string; } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const displayName = payload.displayName
  // const email = payload.email
  const profileImage = payload.profileImage
  try {
    const future = await db.collection('Users').doc(uid).get()
    const exists = future.exists
    const data = future.data()
    const payloadForSave: {displayName?: string; email?: string; profileImage?: string;} = {
    }
    if (exists) {
      if (data) {
        const displayNameFromRemote = data.displayName
        // const emailFromRemote = data.email
        const profileImageFromRemote = data.profileImage
        if (!displayNameFromRemote) payloadForSave.displayName = displayNameFromRemote
        // if (!emailFromRemote) payloadForSave.email = emailFromRemote
        if (!profileImageFromRemote) payloadForSave.profileImage = profileImageFromRemote
      }
    } else {
      if (displayName) payloadForSave.displayName = displayName
      // if (email) payloadForSave.email = email
      if (profileImage) payloadForSave.profileImage = profileImage
    }
    await db.collection('Users').doc(uid).set(payloadForSave, { merge: true })
    // if (displayName) Object.assign(payloadForSave, { displayName })
    // if (email) {
    //   Object.assign(payloadForSave,
    //     { email })
    // }
    // if (profileImage) {
    //   Object.assign(payloadForSave,
    //     { profileImage })
    // }
    // if (payloadForSave !== {}) {
    //   await db.collection('Users').doc(uid).set(payloadForSave, { merge: true })
    // }
    ctx.body = {
      success: true
    }
  } catch (error) {
    console.log(error)
    ctx.throw(
      ERRORS.REQUEST_FAILED.code,
      ERRORS.REQUEST_FAILED.message,
      { error: error }
    )
  }
}
