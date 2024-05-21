import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { HistoryCard } from "../components/HistoryCard";
import { Modal } from "../components/Modal";
import { Preloader } from "../components/Preloader";
import { Title } from "../components/Title";
import { useAppActions } from "../store/app/hooks";
import { IHistoryEmail } from "../store/posts";
import { usePostsActions } from "../store/posts/hooks";
import { postsIsFetchingSelector, postsMailDraftsSelector } from "../store/posts/selectors";

const StyledTitle = styled(Title)`
  margin-bottom: 10px;
`;


const CenteredText = styled.p`
    text-align: center;
`

const Content = styled.div`
  max-width: 1090px;
  padding: 30px 20px 20px;
  height: calc(80vh - 90px);
  overflow-y: auto;
`;

const DraftsView = React.memo(() => {
  const { t } = useTranslation();
  const mailDrafts = useSelector(postsMailDraftsSelector)
  const isFetching = useSelector(postsIsFetchingSelector)
  const { onSetModal } = useAppActions();
  const { onGetDrafts, onDeleteDraft, onSetCurrentDraft } = usePostsActions();

  useEffect(() => {
    onGetDrafts();
  }, []);

  const handleClick = (draft: IHistoryEmail) => {
    onSetCurrentDraft(draft)
    onSetModal("email-editor")
  }

  return (
    <Modal onClose={() => onSetModal(null)}>
      <StyledTitle>{t("drafts-title")}</StyledTitle>
      <Content>
      {isFetching && <Preloader />}
      {mailDrafts.length === 0 && !isFetching && <CenteredText>{t('drafts-no_drafts')}</CenteredText>}
        {mailDrafts.map(draft => (
                        <HistoryCard
                        key={draft.id}
                        onDelete={() => onDeleteDraft(draft.id)}
                        item={draft}
                        onClick={() => handleClick(draft)}
                      />
        ))}
    </Content>
    </Modal>
  );
});

export default DraftsView;
