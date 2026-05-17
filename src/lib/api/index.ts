import { Hono } from 'hono'
import v1 from './v1'

const api = new Hono().basePath('/api')

api.route('/v1', v1)

export default api