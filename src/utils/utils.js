import jwt from 'jsonwebtoken'
export const APP_SECRET = 'GraphQL-is-aw3some'

export function getUserId(context) {
    const Authorization = context.req.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '') // remove Bearer
        const { userId } = jwt.verify(token, APP_SECRET)
        return userId
    }

    throw new Error('Not authenticated')
}

// export default {
//     APP_SECRET,
//     getUserId,
// }