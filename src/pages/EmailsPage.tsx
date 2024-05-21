import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import bg from "../assets/img/bg.png";
import {
  ActionsView,
  AddUser,
  BirthdaysEditor,
  ClientsEditor,
  DraftsView,
  SinglePostEditor,
  EmailsHistory,
  PostsFilter,
  PostsView,
  MultiPostEditor,
  BugReportView,
} from "../views";
import { useTranslation } from "react-i18next";
import { usePostsActions } from "../store/posts/hooks";
import { useClientsActions } from "../store/clients";
import KeywordEditor from "../views/KeywordEditor";
import { useKeywordsActions } from "../store/keywords/hooks";
import { useUserActions, useUserState } from "../store/user/hooks";
import { useUsersActions } from "../store/users";
import { useAppActions, useAppState } from "../store/app/hooks";
import { ClientsFilter } from "../components/ClientsFilter";
import { ClientsBirthday } from "../components/ClientsBirthday";
import { usersWithAdditionalColumn } from "../config/usersWithAdditionalColumn";
import { LogoutButton } from "../components/LogoutButton";
import { IMultiPost, ISinglePost } from "../store/posts";
import { composeMultiPosts } from "../utilites/composeMultiPosts";
import { useSelector } from "react-redux";
import {
  postsCurrentDraftSelector,
  postsEditorPostSelector,
  postsPostsSelector,
} from "../store/posts/selectors";
import logMultiPostsTests from "../tests/composeMultiPosts/logMultiPostsTests";

const Emails = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(${bg});
  background-size: cover;
  overflow-y: auto;
  background-repeat: no-repeat;
  background-position: center;
  padding-top: 25px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: url(${bg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 1400px;
  flex-grow: 1;
  padding: 0 20px 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin: 0 auto;
`;

const StyledLogoutBtn = styled(LogoutButton)`
  align-self: flex-end;
  margin-inline-end: 40px;
`;


const SPEC_FILES_LIST_NAME = "פרוטוקול ועדה"

const firstColumnNodes = ["news",
  "govil",
  "gov_statisctics",
  "govil_data",
  "govil_pdf",
  "antique",
  "antique_trends",
  "news_11",
  "iplan",
  "mavat",
  "dynamic_collector_first",
  "dynamic_collector_second",
  "dynamic_collector_third",
  "isa",
  "boi"
]

const secondColumnNodes = [
  "plenum_session",
  "agendas",
  "person_to_position",
  "query",
  "press_release",
  "committee_session",
  "sg_presidium",
]

const thirdColumnNodes = ["cs_documents"]

const fourthColumnNodes = ["google_news", "news_with_login"]

const EmailsPage = React.memo(() => {
  const { t } = useTranslation();
  const editorPost = useSelector(postsEditorPostSelector);
  const currentDraft = useSelector(postsCurrentDraftSelector);
  const posts = useSelector(postsPostsSelector);
  const { modal } = useAppState();
  const { onGetClients } = useClientsActions();
  const { token, login } = useUserState();
  const { onLogout } = useUserActions();
  const { onGetPosts, onWatchForPosts, onSetEditor } = usePostsActions();
  const { onGetKeywords } = useKeywordsActions();
  const { onGetUsers } = useUsersActions();
  const { onSetModal } = useAppActions()



  const userWithAdditionalColumn = useMemo(() => {
    return usersWithAdditionalColumn.find((user) => user.login === login);
  }, [login]);

  //First column
  const firstColumn = useMemo(() => {
    return posts
      .filter((post) => firstColumnNodes.includes(post._sender))
      .sort((prev, next) => next.date_for_sorting - prev.date_for_sorting);
  }, [posts]);

  //Second column
  const billSinglePosts = useMemo(() => {
    return posts.filter((post) => post._sender === "bill");
  }, [posts])

  const billPosts: Array<ISinglePost | IMultiPost> = useMemo(() => {
    const multiPosts = composeMultiPosts(billSinglePosts);
    const singleFiltered = billSinglePosts.filter(post => {
      let isInMPosts = false
      multiPosts.forEach(m => {
        m.posts.forEach(p => {
          if (p.id === post.id) isInMPosts = true
        })
      })
      return !isInMPosts
    })

    //logMultiPostsTests(singlePosts)

    return [...multiPosts, ...singleFiltered].sort(
      (prev, next) => next.date_for_sorting - prev.date_for_sorting
    );
  }, [billSinglePosts]);


  const secondColumn = useMemo(() => {
    const filtered = posts.filter(
      (post) => {
        if (!secondColumnNodes.includes(post._sender)) return false
        if (post._sender === "committee_session" && post.files?.hasOwnProperty(SPEC_FILES_LIST_NAME)) return false
        return true
      }
    )
    return [...billPosts, ...filtered].sort((prev, next) => next.date_for_sorting - prev.date_for_sorting)
  }, [posts, billPosts, secondColumnNodes])



  //Third column
  const thirdColumn = useMemo(() => {
    const list = posts
      .filter(p => thirdColumnNodes.includes(p._sender))
      .sort((prev, next) => next.date_for_sorting - prev.date_for_sorting)
    return list
  }, [posts])


  //Fourth column
  const fourthColumn = useMemo(() => {
    return posts
      .filter(
        (post) =>
          fourthColumnNodes.includes(post._sender)
      )
      .sort((prev, next) => next.date_for_sorting - prev.date_for_sorting);
  }, [posts, fourthColumnNodes]);

  //Additional column
  const additionalPosts = useMemo(() => {
    if (!userWithAdditionalColumn) return [];
    return posts
      .filter((post) => post.tag === userWithAdditionalColumn.tag)
      .sort((prev, next) => next.date_for_sorting - prev.date_for_sorting);
  }, [posts, userWithAdditionalColumn]);


  useEffect(() => {
    onGetPosts();
    onGetClients();
    onGetKeywords();
    onGetUsers();
  }, []);

  useEffect(() => {
    if (token) onWatchForPosts(token);
  }, [token]);

  useEffect(() => {
    console.log("single posts shown", posts.length)
  }, [posts.length])


  return (
    <>
      <Emails>
        <StyledLogoutBtn onClick={onLogout} />
        <PostsFilter />
        <ClientsFilter />
        <ClientsBirthday />
        {userWithAdditionalColumn && (
          <Content>
            <PostsView
              isWide={true}
              posts={additionalPosts}
              title={t("emails_title3")}
            />
          </Content>
        )}
        <Content>
          <PostsView
            isWide={false}
            posts={firstColumn}
            title={t("emails_title2")}
          />
          <PostsView
            isWide={false}
            posts={secondColumn}
            title={t("emails_title4")}
          />
        </Content>
        <Content>
          <PostsView
            isWide={false}
            posts={thirdColumn}
            title={t("emails_title5")}
          />
          <PostsView
            isWide={false}
            posts={fourthColumn}
            title={t("emails_title1")}
          />
        </Content>
        <ActionsView />
      </Emails>
      {modal === "email-editor" && editorPost?._type !== "multipost" && (
        <SinglePostEditor
          draft={currentDraft}
          posts={posts}
          post={editorPost as ISinglePost}
          onClose={() => onSetModal(null)}
        />
      )}
      {modal === "email-editor" && editorPost?._type === "multipost" && (
        <MultiPostEditor item={editorPost as IMultiPost} />
      )}
      {modal === "client-editor" && <ClientsEditor />}
      {modal === "keyword-editor" && <KeywordEditor />}
      {modal === "add-user" && <AddUser />}
      {modal === "emails-history" && <EmailsHistory />}
      {modal === "birthdays-editor" && <BirthdaysEditor />}
      {modal === "drafts" && <DraftsView />}
      {modal === "bug_report" && <BugReportView />}
    </>
  );
});

export default EmailsPage;