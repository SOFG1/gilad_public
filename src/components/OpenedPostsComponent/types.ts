import { ISinglePost, node } from "../../store/posts";

export interface IProps {
    openedPosts: ISinglePost[]
    usedPosts: {[key: string]: number[]}
    onUsedPostSelect: (node: node ,postId: number)=> void
}