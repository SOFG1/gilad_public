import React, { useCallback } from 'react'
import { useSelector } from 'react-redux';
import { useAppActions } from "../../store/app/hooks";
import { FilterClient, IMultiPost, ISinglePost } from "../../store/posts";
import { usePostsActions } from "../../store/posts/hooks";
import { postsClientsFilterSelector } from '../../store/posts/selectors';
import { MultiPostCard, SinglePostCard } from "../../views";

interface IProps {
  posts: Array<ISinglePost | IMultiPost>;
}

const PostsList = React.memo(({ posts }: IProps) => {
  const clientsFilter = useSelector(postsClientsFilterSelector)
  const { onSetEditor, onSetClientsFilter } = usePostsActions();
  const { onSetModal } = useAppActions();



  const handleSelectClient = useCallback((client: FilterClient) => {
    if (client.id === clientsFilter?.id) onSetClientsFilter(null);
    if (client.id !== clientsFilter?.id) onSetClientsFilter(client);
  }, [clientsFilter])

  const onOpenEditor = useCallback((post: ISinglePost | IMultiPost) => {
    onSetEditor(post);
    onSetModal("email-editor");
  }, [])

  return (
    <>
      {posts.map((post, index) => {
        if (post._type) {
          return (
            <MultiPostCard
              key={index}
              onSelectClient={handleSelectClient}
              item={post as IMultiPost}
              onEmail={() => onOpenEditor(post)}
            />
          );
        }
        //@ts-ignore
        const key = `${post._sender} ${post.id}`
        return (
          <SinglePostCard
            key={key}
            onSelectClient={handleSelectClient}
            item={post as ISinglePost}
            onEmail={() => onOpenEditor(post)}
          />
        );
      })}
    </>
  );
})

export default PostsList;
