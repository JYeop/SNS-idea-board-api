
import { auth, db, incrementValue } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const deleteComment = async (ctx: IContext, next: Next) => {
  const payload: {
      commentId: string;
  } = ctx.request.body
  const decodedIdToken = ctx.decodedIdToken
  const uid = decodedIdToken.uid
  const commentId = payload.commentId
  if (!commentId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No commentId' }
    )
    return
  }
  try {
    const ref = db.collection('PostComments').doc(commentId)
    const fetched = await ref.get()
    const fetchedData = fetched.data()
    if (fetchedData?.writerUid !== uid) {
      ctx.throw(
        ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
        ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
        { error: 'Request uid is different with the comment writer' }
      )
      return
    }
    const postId = fetchedData?.postId
    if (postId) {
      await ref.delete()
      await db.collection('Posts').doc(postId).update({
        comments: incrementValue(-1)
      })
    }
    ctx.body = {
      success: true
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
