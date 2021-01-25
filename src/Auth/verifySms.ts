import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const verifySms = async (ctx: IContext, next: Next) => {
  const body: { verification: string; phoneNumber: string; } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const phoneNumber = body.phoneNumber
  const verification = body.verification
  if (!phoneNumber) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No phoneNumber' }
    )
    return
  }
  if (!verification) {
    if (!phoneNumber) {
      ctx.throw(
        ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
        ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
        { error: 'No verification' }
      )
      return
    }
  }
  try {
    const result = await db.collection('SmsVerification')
      .where('uid', '==', uid)
      .where('phoneNumber', '==', phoneNumber)
      .where('verification', '==', verification)
      .where('timestamp', '>=', Date.now() - 1000 * 60 * 3)
    // 일단 한개라도 있으면 통과
    // .orderBy('timestamp', 'desc')
      .limit(1).get()
    if (!result.empty) {
      await db.collection('Users').doc(uid).update({
        phone: phoneNumber
      })
      await db.collection('Users').doc(uid).collection('SmsVerification').add({
        phone: phoneNumber,
        verificationNumber: verification,
        verificationTimestamp: Date.now()
      })
      ctx.body = {
        success: true
      }
      return
    }
    ctx.body = {
      success: false,
      error: 'No matched verification or timestamp'
    }
    // ctx.throw(
    //   ERRORS.VERIFY_WITH_SMS_FAILED.code,
    //   ERRORS.VERIFY_WITH_SMS_FAILED.message,
    //   { error: 'No matched verification or timestamp' }
    // )
  } catch (error) {
    console.log(error)
    ctx.throw(
      ERRORS.VERIFY_WITH_SMS_FAILED.code,
      ERRORS.VERIFY_WITH_SMS_FAILED.message,
      { error: error }
    )
  }
}
