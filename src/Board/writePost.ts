import { auth, db } from '../firebase'
import { IPost } from '../dbInterfaces'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const writePost = async (ctx: IContext, next: Next) => {
  const payload: {
    body: string;
    postId: string;
    imageUrls?: string[];
    thumbnailUrls?: string[];
    categories?: string[];
  } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const body = payload.body
  const postId = payload.postId
  const imageUrls = payload.imageUrls
  const thumbnailUrls = payload.thumbnailUrls

  let categories = payload.categories
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
  if (!categories) {
    categories = ['free']
  }
  // 아직은 휴대폰 제한을 하지 않을 것. 유저가 좀 생기면 휴대폰 인증으로 제한을 해야겠음.
  // const userData = await db.collection('Users').doc(uid).get();
  // const verifiedPhone = userData.data()?.verifiedPhone;
  // if (!verifiedPhone) {
  //     return {
  //         success: false,
  //         hasError: true,
  //         error: 'No phone verification'
  //     };
  // }
  const startTime = Date.now()
  const remoteUser = await auth.getUser(user.uid)
  const endTime = Date.now()
  console.log(`GetUser took ${(endTime - startTime) / 1000}sec`)
  const name = remoteUser.displayName ?? 'No Name'
  try {
    const payload: IPost = {
      name,
      body,
      categories,
      read: 0,
      writerUid: uid,
      likes: 0,
      comments: 0,
      visible: true,
      createdAt: Date.now()
    }
    if (imageUrls) {
      Object.assign(payload, { imageUrls })
    }
    if (thumbnailUrls) {
      Object.assign(payload, { thumbnailUrls })
    }
    await db.collection('Posts').doc(postId).set(payload)
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
