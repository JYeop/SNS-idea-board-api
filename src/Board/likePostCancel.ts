import { admin, db, incrementValue } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const likePostCancel = async (ctx: IContext, next: Next) => {
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
    const docs = await db.collection('PostLikes').where('uid', '==', uid).where('postId', '==', postId)
      .limit(2).get()
    if (!docs.empty) {
      docs.forEach((doc) => {
        db.collection('PostLikes').doc(doc.id).delete()
      })
      await admin.firestore()
        .collection('Posts')
        .doc(postId).update({
          likes: incrementValue(-1)
        })
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
