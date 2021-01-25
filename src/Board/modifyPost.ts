import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const modifyPost = async (ctx: IContext, next: Next) => {
  const payload: {
            init?: boolean;
            postId?: string;
            body?: string;
            visible?: boolean;
            categories?: string;
            imageUrls?: string[];
        } = ctx.request.body
  const user = ctx.decodedIdToken
  const uid = user.uid
  const postId = payload.postId
  const body = payload.body
  const visible = payload.visible
  const categories = payload.categories
  const imageUrls = payload.imageUrls

  if (!postId) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No PostId' }
    )
    return
  }
  const name = user.displayName ?? user.email
  try {
    const fetched = await db.collection('Posts').doc(postId).get()
    const fetchedData = fetched.data()
    if (fetchedData?.writerUid !== uid) {
      ctx.throw(
        ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
        ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
        { error: 'Request uid is different with the post author' }
      )
      return
    }
    const objForUpdate = {
      name,
      modifiedAt: Date.now()
    }
    if (imageUrls) {
      Object.assign(objForUpdate, {
        imageUrls
      })
    }
    if (visible === false || visible === true) {
      Object.assign(objForUpdate, {
        visible
      })
    }
    if (body) {
      Object.assign(objForUpdate, {
        body
      })
    }
    if (categories) {
      Object.assign(objForUpdate, {
        categories
      })
    }
    console.log(objForUpdate)
    await db.collection('Posts').doc(postId).update(
      objForUpdate
    )
    ctx.body = {
      success: true,
      data: objForUpdate
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
