import axios from 'axios'
import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const sendSms = async (ctx: IContext, next: Next) => {
  const body: { phoneNumber: string; } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const phoneNumber = body.phoneNumber

  if (!phoneNumber) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No phoneNumber' }
    )
    return
  }
  try {
    const result = await db.collection('SmsVerification')
      .where('uid', '==', uid)
      .where('timestamp', '>=', Date.now() - 1000 * 60 * 60 * 24)
      .get()
    if (!result.empty && result.docs.length >= 5) {
      // 한 아이디당 하루 최대 5번만 인증가능
      ctx.body = {
        success: false,
        error: 'Day quota exceeded'
        // ERRORS.SENDING_SMS_FAILED.code,
        // ERRORS.SENDING_SMS_FAILED.message,
        // { error: 'Day quota exceeded' }
      }
      return
    }

    const authRandomNumber = Math.floor(100000 + Math.random() * 900000)
    await db.collection('SmsVerification')
      .add({
        uid,
        phoneNumber: phoneNumber,
        verification: String(authRandomNumber),
        timestamp: Date.now()
      })
    const res = await axios({
      url: 'https://api-sms.cloud.toast.com/sms/v2.1/appKeys/8SQO65qmdOyXrpfs/sender/sms',
      method: 'POST',
      data: {
        body: `(남고) 인증번호는 [${String(authRandomNumber)}] 입니다.`,
        sendNo: '07041121001',
        recipientList: [
          {
            recipientNo: String(phoneNumber)
          }
        ]
      }
    })
    if (res.data.header.isSuccessful === true) {
      ctx.body = {
        success: true
      }
      return
    }
    ctx.throw(
      ERRORS.SENDING_SMS_FAILED.code,
      ERRORS.REQUEST_FASENDING_SMS_FAILEDILED.message,
      { error: 'Sending sms has failed' }
    )
  } catch (error) {
    console.log(error)
    ctx.throw(
      ERRORS.REQUEST_FAILED.code,
      ERRORS.REQUEST_FAILED.message,
      { error: error }
    )
  }
}
