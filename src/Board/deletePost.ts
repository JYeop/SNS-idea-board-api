import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const deletePost = async (ctx: IContext, next: Next) => {
  const payload: {
    postId: string;
  } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const postId = payload.postId
  if (!postId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No PostId' }
    )
    return
  }
  try {
    const ref = db.collection('Posts').doc(postId)
    const result = await ref.get()
    if (result.exists) {
      const dbData = result.data()
      const writerUid = dbData?.writerUid
      if (uid !== writerUid) {
        ctx.throw(
          ERRORS.REQUEST_FAILED.code,
          ERRORS.REQUEST_FAILED.message,
          { error: 'Request uid is different with writer' }
        )
        return
      }
      await ref.delete()
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
