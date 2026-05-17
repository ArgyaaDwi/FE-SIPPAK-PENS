import { Hono } from 'hono'
import auth from './routes/auth'
import invoices from './routes/invoices'

const v1 = new Hono()

v1.route('/auth', auth)
v1.route('/invoices', invoices)

export default v1