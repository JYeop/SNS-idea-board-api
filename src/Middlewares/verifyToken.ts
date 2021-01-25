// eslint-disable-next-line no-unused-vars
import { Context, Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'
import { auth } from '../firebase'

export const verifyToken = async (ctx: Context, next: Next) => {
  try {
    const headers = ctx.headers
    const token = headers.token
    const decodedIdToken = await auth.verifyIdToken(token)
    const currentDate = Date.now() / 1000
    const exp = decodedIdToken.exp
    // const iat = user.iat
    // console.log(exp)
    if (currentDate >= exp) {
      ctx.throw(ERRORS.TOKEN_EXPIRED.code, ERRORS.TOKEN_EXPIRED.message, 'The token has expired')
    }
    // console.log(`MIDDLEWARE : ${exp} ${iat}`)
    ctx.decodedIdToken = decodedIdToken
    await next()
  } catch (error) {
    console.log(error)
    ctx.throw(ERRORS.INVALID_TOKEN.code, ERRORS.INVALID_TOKEN.message, { error: error })
  }
}
