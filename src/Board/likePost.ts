import { admin, db, incrementValue } from '../firebase';
import { IPostLike } from '../dbInterfaces'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const likePost = async (ctx: IContext, next: Next) => {
  const payload: {
    body: string;
    postId: string;
    imageUrls?: string[];
    thumbnailUrls?: string[];
    categories?: string[];
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
    const payload: IPostLike = {
      uid,
      postId,
      createdAt: Date.now()
    }
    await db.collection('PostLikes').add(payload)
    await admin.firestore()
      .collection('Posts')
      .doc(postId).update({
        likes: incrementValue(1)
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
