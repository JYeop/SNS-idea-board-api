import { deletePost } from './Board/deletePost'
import { fetchUserInfo } from './Board/fetchUserInfo'
import { leaveComment } from './Board/leaveComment'
import { modifyComment } from './Board/modifyComment'
import { modifyPost } from './Board/modifyPost'
import { readPost } from './Board/readPost'
import { writePost } from './Board/writePost'
import { setUserInfo } from './User/setUserInfo'
import { sendSms } from './Auth/sendSms'
import { verifySms } from './Auth/verifySms'
import { addHospital } from './Admin/addHospital'
import { modifyHospital } from './Admin/modifyHospital'
import { makeUserDoc } from './User/makeUserDoc'
import { likePost } from './Board/likePost'
import { likePostCancel } from './Board/likePostCancel'
import { likePostComment } from './Board/likePostComment'
import { likePostCommentCancel } from './Board/likePostCommentCancel'
import { deleteComment } from './Board/deleteComment'

const Router = require('koa-router')
const router = new Router()
router.get('/check', (context: { body: string }, next: any) => {
  context.body = 'Success'
})
router.get('/', (context: { body: string }, next: any) => {
  context.body = 'Success'
})
router.post('/board/likePost', likePost)
router.post('/board/likePostCancel', likePostCancel)
router.post('/board/likePostComment', likePostComment)
router.post('/board/likePostCommentCancel', likePostCommentCancel)

router.post('/board/deletePost', deletePost)
router.post('/board/fetchUserInfo', fetchUserInfo)
router.post('/board/leaveComment', leaveComment)
router.post('/board/deleteComment', deleteComment)

router.post('/board/modifyComment', modifyComment)
router.post('/board/modifyPost', modifyPost)
router.post('/board/modifyComment', modifyComment)
router.post('/board/writePost', writePost)
router.post('/board/readPost', readPost)
router.post('/user/makeUserDoc', makeUserDoc)
router.post('/user/setUserInfo', setUserInfo)
router.post('/auth/sendSms', sendSms)
router.post('/auth/verifySms', verifySms)
router.post('/admin/addHospital', addHospital)
router.post('/admin/modifyHospital', modifyHospital)

export { router }
