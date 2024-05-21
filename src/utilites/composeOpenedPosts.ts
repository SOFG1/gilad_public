import { ISinglePost } from "../store/posts";

export const composeOpenedPosts = (
    items: { [node: string]: number[] },
    posts: ISinglePost[]
  ): ISinglePost[] => {
    const opened: ISinglePost[] = [];
    Object.keys(items).map((sender) => {
      items[sender].map((postId: number) => {
        const post = posts.find((p) => p._sender === sender && p.id === postId);
        if (post) opened.push(post);
      });
    });
    return opened;
  };