import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { IPostCardClient } from "../store/clients";
import { IMultiPost, ISinglePost } from "../store/posts";
import { usePostsActions } from "../store/posts/hooks";
import { IPostsView } from "./types";
import { Preloader } from "../components/Preloader";
import { useTranslation } from "react-i18next";
import { MainButton } from "../components/MainButton";
import { Title } from "../components/Title";
import { PostsList } from "../components/PostsList";
import { useSelector } from "react-redux";
import { postsClientsFilterSelector, postsIsFetchingSelector, postsNewPostsSelector } from "../store/posts/selectors";

const Wrapper = styled.div<{ isWide: boolean }>`
  ${({ isWide }) => isWide && "width: 100%;"}
`;

const PostsContainer = styled.div<{ isWide: boolean }>`
  padding: 20px;
  min-width: 600px;
  background: #eeeeee;
  border: 1px solid #c2fffd;
  box-shadow: 0px 8px 25px rgb(0 0 0 / 5%);
  border-radius: 20px;
  & > div {
    height: 550px;
    width: 540px;
    overflow-y: auto;
    ${({ isWide }) =>
      isWide &&
      `
    width: 100%;
    height: 400px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  `}
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 10px;
`;

const NewPostsBtn = styled(MainButton)`
  display: block;
  margin: 30px auto;
`;

const StyledPreloader = styled(Preloader)`
  grid-column: span 2;
`;

const PostsView = React.memo(({ posts, title, isWide }: IPostsView) => {
  const { t } = useTranslation();
  const clientsFilter = useSelector(postsClientsFilterSelector)
  const isFetching = useSelector(postsIsFetchingSelector)
  const newPosts = useSelector(postsNewPostsSelector)
  const {onUpdateNewPosts } =
    usePostsActions();

  //Case when set clients filter
  const filteredPosts: Array<ISinglePost | IMultiPost> = useMemo(() => {
    return posts.filter((post: ISinglePost | IMultiPost) => {
      if (clientsFilter && !post.clients) return false;
      if (clientsFilter && post.clients) {
        return post.clients.some(
          (client: IPostCardClient) => client.id === clientsFilter.id
        );
      }
      if (!clientsFilter) return true;
      return false;
    });
  }, [posts, clientsFilter]);

  return (
    <Wrapper isWide={isWide}>
      <StyledTitle>{title}</StyledTitle>
      <PostsContainer isWide={isWide}>
        {newPosts.length > 0 && !isFetching && (
          <NewPostsBtn color="orange" onClick={onUpdateNewPosts}>
            {`${t("emails_new-available")}`}
          </NewPostsBtn>
        )}
        <div>
          {isFetching && <StyledPreloader />}
          <PostsList posts={filteredPosts} />
        </div>
      </PostsContainer>
    </Wrapper>
  );
});

export default PostsView;
