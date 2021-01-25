import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const addHospital = async (ctx: IContext, next: Next) => {
  const payload: {
            name: string;
            homepage?: string;
            reimbursementAvailable: boolean;
            lat: number;
            long: number;
            address: string;
            phone?: string;
            tags: string[];
            googleMapUrl?: string;
        } = ctx.request.body
        // console.log(payload);
  const user = ctx.decodedIdToken
  const isAdmin = user?.token?.admin
  if (!isAdmin) {
    return {
      success: false,
      hasError: true,
      error: 'Not admin'
    }
  }
  const name = payload.name
  const reimbursementAvailable = payload.reimbursementAvailable
  const homepage = payload.homepage
  const lat = payload.lat
  const long = payload.long
  const address = payload.address
  const tags = payload.tags
  const googleMapUrl = payload.googleMapUrl

  if (!name) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No displayName' }
    )
    return
  }

  if (reimbursementAvailable === undefined || reimbursementAvailable === null) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No reimbursementAvailable' }
    )
    return
  }
  if (!lat) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No lat' }
    )
    return
  }
  if (!long) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No long' }
    )
    return
  }
  if (!address) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No address' }
    )
    return
  }
  if (!tags) {
    ctx.throw(
      ERRORS.MISSING_REQUIRED_ARGUMENTS.code,
      ERRORS.MISSING_REQUIRED_ARGUMENTS.message,
      { error: 'No tags' }
    )
    return
  }
  try {
    // const isExist = (await db.collection('Hospitals')
    //     .where('name', '==', name).limit(1).get()).docs.length > 0;
    // if (isExist)
    const objForSave = {
      name, lat, long, address, tags, reimbursementAvailable
    }
    if (homepage) Object.assign(objForSave, { homepage })
    if (googleMapUrl) Object.assign(objForSave, { googleMapUrl })
    await db.collection('Hospitals').add(objForSave)
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
