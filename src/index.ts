import { router } from './routers'
import { verifyToken } from './Middlewares/verifyToken'
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())
app.use(verifyToken)
app
  .use(router.routes())
  .use(router.allowedMethods())
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})
