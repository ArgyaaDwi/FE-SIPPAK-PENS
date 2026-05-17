import { Hono } from 'hono'
import auth from './routes/auth'

const v1 = new Hono()

v1.route('/auth', auth)

export default v1