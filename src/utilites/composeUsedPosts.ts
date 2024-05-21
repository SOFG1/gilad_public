import { ISinglePost } from "../store/posts";

export const composeUsedPosts = (posts: ISinglePost[]): {[key: string]: number[]} => {
    const items: {[key: string]: number[]} = {}
    posts.forEach((post: ISinglePost) => {
        if(!items.hasOwnProperty(post._sender)) {
            items[post._sender] = [post.id]
            return
        }
        if(!items[post._sender].includes(post.id)) {
            items[post._sender].push(post.id)
        }
    });
    return items
}