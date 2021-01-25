import { auth, db, incrementValue } from '../firebase'
import { IPostComment } from '../dbInterfaces'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const leaveComment = async (ctx: IContext, next: Next) => {
  const payload: {
    body: string;
    postId: string;
    parentComment?: string;
  } = ctx.request.body
  const decodedIdToken = ctx.decodedIdToken

  const uid = decodedIdToken.uid
  const body = payload.body
  const postId = payload.postId
  // 답글 달 코멘트의 uid임.
  const parentComment = payload.parentComment
  if (!body) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No body' }
    )
    return
  }
  if (!postId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No PostId' }
    )
    return
  }
  const userFromRemote = await auth.getUser(uid)
  const name = userFromRemote.displayName ?? 'No name'
  // const userData = await db.collection('Users').doc(uid).get()
  // const data = userData.data()
  // const name = data?.displayName ?? 'No name'

  try {
    const payloadForSave: IPostComment = {
      writerUid: uid,
      postId,
      name,
      body,
      likes: 0,
      subComments: 0,
      createdAt: Date.now(),
      parentComment: null
    }
    if (parentComment) {
      Object.assign(payloadForSave, { parentComment })
    }
    await db.collection('PostComments').add(payloadForSave)
    await db.collection('Posts').doc(postId).update({ comments: incrementValue(1) })
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
