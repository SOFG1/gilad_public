import { ISinglePost, MarkAsSentPayload } from "../store/posts";




export const markPostsAsSent = (posts: ISinglePost[], items: MarkAsSentPayload): ISinglePost[] => {
    return posts.map(p => {
        const sended: boolean =  !!items[p._sender]?.includes(p.id)
        return {
            ...p,
            sended: p.sended || sended
        }
    })

}