
import { auth, db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const modifyComment = async (ctx: IContext, next: Next) => {
  const payload: {
            body: string;
            commentId: string;
        } = ctx.request.body
  const decodedIdToken = ctx.decodedIdToken
  const uid = decodedIdToken.uid
  const body = payload.body
  const commentId = payload.commentId
  if (!body) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No body' }
    )
    return
  }
  if (!commentId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No commentId' }
    )
    return
  }
  const userFromRemote = await auth.getUser(uid)
  const name = userFromRemote.displayName ?? 'No name'
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
    const payloadForSave: {
                name: string;
                body: string;
                modifiedAt: number;
            } = {
              name,
              body,
              modifiedAt: Date.now()
            }
    await ref.update(payloadForSave)
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
