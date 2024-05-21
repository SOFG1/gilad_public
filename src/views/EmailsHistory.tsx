import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { ButtonBox } from "../components/ButtonBox";
import { HistoryCard } from "../components/HistoryCard";
import { MainButton } from "../components/MainButton";
import { Modal } from "../components/Modal";
import { Preloader } from "../components/Preloader";
import { TextInput } from "../components/TextInput";
import { Title } from "../components/Title";
import { useAppActions } from "../store/app/hooks";
import { IHistoryEmail, ISinglePost } from "../store/posts";
import { usePostsActions } from "../store/posts/hooks";
import { postsCurrentDraftSelector, postsEditorPostSelector, postsHistoryEmailsSelector, postsHistorySearchQuerySelector, postsIsFetchingHistorySelector } from "../store/posts/selectors";
import HistoryItem from "./HistoryItem";
import SinglePostEditor from "./SinglePostEditor";

const Content = styled.div`
  max-width: 1090px;
  padding: 30px 20px 20px;
  height: calc(80vh - 90px);
  overflow-y: auto;
`;

const StyledClose = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 10px;
`;

const SearchInput = styled(TextInput)`
  flex-grow: 1;
  margin-bottom: 15px;
  input {
    padding: 8px 15px;
  }
`;

const EmailsHistory = React.memo(() => {
  const { t } = useTranslation();
  const historyEmails = useSelector(postsHistoryEmailsSelector)
  const isFetchingHistory = useSelector(postsIsFetchingHistorySelector)
  const historySearchQuery = useSelector(postsHistorySearchQuerySelector)
  const { onSetModal } = useAppActions();
  const { onGetHistory, onClearHistory, onSetCurrentDraft, onSetSearchQuery } = usePostsActions();
  const currentDraft = useSelector(postsCurrentDraftSelector);
  const [openedItem, setOpenedItem] = useState<IHistoryEmail | null>(null);


  const ScrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      onClearHistory()
      onSetSearchQuery('')
    }
  }, []);

  useEffect(() => {
    onGetHistory()
  }, [historySearchQuery])

  useEffect(() => {
    if (historyEmails.length === 0 && !historySearchQuery) {
      onGetHistory();
    }
  }, [historyEmails, historySearchQuery]);

  useEffect(() => {
    ScrollableRef?.current?.addEventListener("scroll", handleScroll);
    return () =>
      ScrollableRef?.current?.removeEventListener("scroll", handleScroll);
  }, [ScrollableRef, historySearchQuery]);

  const handleScroll = ({ target }: any) => {
    const onBottom =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 30;
    if (onBottom && historySearchQuery === '') {
      console.log(historySearchQuery)
      onGetHistory()
    }
  }

  const handleSend = (item: IHistoryEmail) => {
    onSetCurrentDraft(item);
  };


  if (openedItem) {
    return <HistoryItem item={openedItem} onBack={() => setOpenedItem(null)} />;
  }

  return (
    <>
      <Modal onClose={() => onSetModal(null)}>
        <Content ref={ScrollableRef}>
          <StyledTitle>{t("emails_send-history_title")}</StyledTitle>
            <SearchInput
              label="Search"
              value={historySearchQuery}
              onChange={onSetSearchQuery}
              searchBtn={true}
            />
          {historyEmails.map((item) => (
            <HistoryCard
              onSend={() => handleSend(item)}
              key={item.id}
              item={item}
              onClick={() => setOpenedItem(item)}
            />
          ))}
          {isFetchingHistory && <Preloader />}
        </Content>
        <ButtonBox>
          <StyledClose onClick={() => onSetModal(null)} color="blue">
            {t("emails_send-history_close")}
          </StyledClose>
        </ButtonBox>
      </Modal>
      {currentDraft && (
        <SinglePostEditor
          draft={currentDraft}
          onClose={() => onSetCurrentDraft(null)}
          posts={[]}
          post={null}
        />
      )}
    </>
  );
});

export default EmailsHistory;
