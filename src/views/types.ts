import { IMultiPost, ISinglePost } from "../store/posts/types";


export interface IPostsView {
    posts: Array<ISinglePost |IMultiPost>
    title: string
    isWide: boolean
}
