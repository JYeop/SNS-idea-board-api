import { Context } from 'koa'
import admin from 'firebase-admin'

export interface IResult{
  result: boolean;
  error?: String;
}

export interface IContext extends Context{
  user: admin.auth.DecodedIdToken;
}
