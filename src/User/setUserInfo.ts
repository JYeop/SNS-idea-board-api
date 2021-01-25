import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const setUserInfo = async (ctx: IContext, next: Next) => {
  const payload: { fcmToken?: string; receiveNotification?: boolean; } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const fcmToken = payload.fcmToken
  const receiveNotification = payload.receiveNotification
  try {
    const payloadForSave = {}
    if (fcmToken) Object.assign(payloadForSave, { fcmToken })
    if (receiveNotification || receiveNotification === false) {
      Object.assign(payloadForSave,
        { receiveNotification })
    }
    if (payloadForSave !== {}) {
      await db.collection('Users').doc(uid).set(payloadForSave, { merge: true })
    }
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
