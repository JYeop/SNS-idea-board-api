import { admin, incrementValue } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const readPost = async (ctx: IContext, next: Next) => {
  const payload: {
            postId: string;
        } = ctx.request.body
  // const user = ctx.decodedIdToken
  // const uid = user.uid
  const postId = payload.postId
  if (!postId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No PostId' }
    )
  }
  try {
    await admin.firestore()
      .collection('Posts')
      .doc(postId).update({
        read: incrementValue(1)
      })
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
