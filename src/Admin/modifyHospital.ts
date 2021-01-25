import { db } from '../firebase'
import { IContext } from '../Interfaces'
import { Next } from 'koa'
import { ERRORS } from '../Error/errorCodes'

export const modifyHospital = async (ctx: IContext, next: Next) => {
  const payload: {
            init?: boolean;
            hospitalId: string;
            name?: string;
            homepage?: string;
            reimbursementAvailable?: boolean;
            lat?: number;
            long?: number;
            address?: string;
            phone?: string;
            tags?: string[];
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
  const hospitalId = payload.hospitalId
  const name = payload.name
  const reimbursementAvailable = payload.reimbursementAvailable
  const homepage = payload.homepage
  const lat = payload.lat
  const long = payload.long
  const address = payload.address
  const tags = payload.tags
  const googleMapUrl = payload.googleMapUrl
  try {
    // const isExist = (await db.collection('Hospitals')
    //     .where('name', '==', name).limit(1).get()).docs.length > 0;
    // if (isExist)
    const objForSave = {
      // name, lat, long, address, tags, reimbursementAvailable
    }
    if (name) Object.assign(objForSave, { name })
    if (lat) Object.assign(objForSave, { lat })
    if (long) Object.assign(objForSave, { long })
    if (address) Object.assign(objForSave, { address })
    if (tags) Object.assign(objForSave, { tags })
    if (reimbursementAvailable) Object.assign(objForSave, { reimbursementAvailable })
    if (homepage) Object.assign(objForSave, { homepage })
    if (googleMapUrl) Object.assign(objForSave, { googleMapUrl })
    await db.collection('Hospitals').doc(hospitalId).update(objForSave)
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
