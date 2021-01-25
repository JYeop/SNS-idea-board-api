import { admin, db, incrementValue } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const likePostCommentCancel = async (ctx: IContext, next: Next) => {
  const payload: {
    commentId: string;
  } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const commentId = payload.commentId

  if (!commentId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No CommentId' }
    )
    return
  }
  try {
    const docs = await db.collection('PostCommentLikes')
      .where('uid', '==', uid)
      .where('commentId', '==', commentId)
      .limit(2).get()
    if (!docs.empty) {
      docs.forEach((doc) => {
        db.collection('PostCommentLikes').doc(doc.id).delete()
      })
      await admin.firestore()
        .collection('PostComments')
        .doc(commentId).update({
          likes: incrementValue(-1)
        })
      ctx.body = {
        success: true
      }
      return
    }
    ctx.body = {
      success: false,
      message: 'The document already has been deleted'
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
