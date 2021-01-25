import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'
import { auth, db } from '../firebase'

export const fetchUserInfo = async (ctx: IContext, next: Next) => {
  // const user = ctx.decodedIdToken
  // const uid = user.uid
  const payload: {
        uid: string;
    } = ctx.request.body
  try {
    const userUid = payload.uid
    const userFromRemote = await auth.getUser(userUid)
    const userName = userFromRemote.displayName ?? 'No name'
    // const remoteData = await db.collection('Users').doc(userUid).get()
    // const data = remoteData.data()

    // const user = await auth.getUser(userUid)
    if (userName) {
      ctx.body = {
        success: true,
        userName
      }
      return
    }
    ctx.body = {
      success: false
    }
    return
  } catch (error) {
    console.log(error)
    ctx.throw(
      ERRORS.REQUEST_FAILED.code,
      ERRORS.REQUEST_FAILED.message,
      { error: error }
    )
  }
}
