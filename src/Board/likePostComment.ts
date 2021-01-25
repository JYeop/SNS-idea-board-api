import { admin, db, incrementValue } from '../firebase'
import { IPostCommentLike } from '../dbInterfaces'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const likePostComment = async (ctx: IContext, next: Next) => {
  const payload: {
    commentId: string;
    postId: string;
  } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const commentId = payload.commentId
  const postId = payload.postId

  if (!commentId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No CommentId' }
    )
    return
  }
  try {
    const payload: IPostCommentLike = {
      uid,
      postId,
      commentId,
      createdAt: Date.now()
    }
    const isExist = await db.collection('PostCommentLikes')
      .where('commentId', '==', commentId).where('uid', '==', uid).get()
    if (isExist.empty) {
      await db.collection('PostCommentLikes').add(payload)
      await admin.firestore()
        .collection('PostComments')
        .doc(commentId).update({
          likes: incrementValue(1)
        })
      ctx.body = {
        success: true
      }
      return
    }
    ctx.body = {
      success: false,
      message: 'The document already has been created'
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
