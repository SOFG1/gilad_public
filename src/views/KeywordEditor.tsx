import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TextInput } from "../components/TextInput";
import { Dropdown } from "../components/Dropdown";
import { AddButton } from "../components/AddButton";
import { colors } from "../assets/styles/colors";
import { MainButton } from "../components/MainButton";
import { useTranslation } from "react-i18next";
import { useKeywordsActions, useKeywordsState } from "../store/keywords/hooks";
import { useClientsState } from "../store/clients";
import { IEditKeyword } from "../store/keywords";
import { PostKeyword } from "../components/PostKeyword";
import { Title } from "../components/Title";
import { ButtonBox } from "../components/ButtonBox";
import { DropdownSearch } from "../components/DropdownSearch";
import { Modal } from "../components/Modal";
import { useAppActions } from "../store/app/hooks";
import { ItemsBox } from "../components/ItemsBox";

const Editor = styled.div<{ isLoading: boolean }>`
  ${({ isLoading }) => isLoading && "& * {cursor: wait !important;}"}
`;

const Content = styled.div`
  padding: 40px 30px 30px;
`;

const KeywordsBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const StyledInput = styled(TextInput)`
margin-bottom: 20px;
  & input {
    padding: 10px 20px;
  }
  & input::placeholder {
    text-decoration: underline;
  }
`;

const StyledDropdown = styled(DropdownSearch)`
  min-width: 261px;
`

const StyledBtn = styled(AddButton)`
  margin-top: 22px;
  flex-shrink: 0;
`;

const ErrorMessage = styled.p`
margin-top: 10px;
  color: red;
  text-align: center;
`

const StyledKeyword = styled(PostKeyword)<{
  isSelected: boolean;
  isLoading: boolean;
}>`
  ${({ isSelected }) => {
    return (
      isSelected &&
      `
    & p {color: ${colors.orange}};
    &:hover p { opacity: 1;}
  `
    );
  }}
  ${({ isLoading }) => isLoading && "cursor: wait;"}
`;

const StyledAction = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const KeywordEditor = React.memo(() => {
  const { t } = useTranslation();
  const {onSetModal} = useAppActions()
  const { keywords, isLoading, selectedKeyword, errorMessage } = useKeywordsState();
  const {
    onAddKeyword,
    onSelectKeyword,
    onDeselectKeyword,
    onEditKeyword,
    onDeleteKeyword,
  } = useKeywordsActions();
  const { clients } = useClientsState();
  const [selectedClients, setSelectedClients] = useState<
    { value: string; label: string }[]
  >([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const searchDeffered = useDeferredValue(search);
  const regex = new RegExp(searchDeffered, "i");

  //Add new keyword in DB
  const handleAdd = () => {
    const data = {
      keyword,
      clients: selectedClients.map((c) => parseInt(c.value, 10)),
    };
    onAddKeyword(data);
  };

  //Fetch selected keyword with clients
  const handleSelect = (id: number) => {
    if (!isLoading) onSelectKeyword(id);
  };

  //Set fields for editing keyword
  useEffect(() => {
    if (selectedKeyword) {
      setKeyword(selectedKeyword.keyword);
      const clientsList = selectedKeyword.clients.map((c) => ({
        value: String(c.id),
        label: c.name,
      }));
      setSelectedClients(clientsList);
    }
  }, [selectedKeyword]);

  //Close modal and deselect keyword
  const handleClose = () => {
    onDeselectKeyword();
    onSetModal(null);
  };

  //Clear selected post on unmount
  useEffect(() => {
    return onDeselectKeyword;
  }, []);

  //Edit Selected keyword in DB
  const handleSave = () => {
    if (selectedKeyword) {
      const data: IEditKeyword = {
        id: selectedKeyword?.id,
        keyword,
        clients: selectedClients.map((c) => parseInt(c.value, 10)),
      };
      onEditKeyword(data);
    }
  };

  const keywordElements = useMemo(() => {
    return searchDeffered
      ? keywords.filter((c) => {
          return regex.test(c.keyword);
        })
      : keywords;
  }, [keywords, searchDeffered]);

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Editor isLoading={isLoading}>
      <Content>
        <Title>{t("keyword-editor_title1")}</Title>
        <KeywordsBox>
          <StyledInput
            value={keyword}
            onChange={setKeyword}
            placeholder={t("keyword-editor_keyword-plhr")}
            label={t("keyword-editor_keyword-label")}
          />
          <StyledDropdown
            label={t("keyword-editor_clients-label")}
            onSelect={setSelectedClients}
            isMulti={true}
            value={selectedClients}
            options={clients.map((c) => ({
              label: c.name,
              value: String(c.id),
            }))}
          />
          <StyledBtn onClick={handleAdd} disabled={isLoading} />
        </KeywordsBox>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Title>{t("keyword-editor_title2")}</Title>
        <StyledInput
          value={search}
          onChange={setSearch}
          label={t("keyword-editor_search")}
          searchBtn={true}
        />
        <ItemsBox>
          {keywordElements.map((k) => (
            <StyledKeyword
            confirmDelMessage={t('keywords_confirm-del')}
              isSelected={selectedKeyword?.id === k.id}
              onDelete={() => onDeleteKeyword(k.id)}
              isLoading={isLoading}
              onClick={() => handleSelect(k.id)}
              key={k.id}
            >
              {k.keyword}
            </StyledKeyword>
          ))}
        </ItemsBox>
      </Content>
      <ButtonBox>
        <StyledAction
          onClick={handleSave}
          color="orange"
          disabled={isLoading || !selectedKeyword}
        >
          {t("keyword-editor_save")}
        </StyledAction>
        <StyledAction onClick={handleClose} color="blue">
          {t("keyword-editor_close")}
        </StyledAction>
      </ButtonBox>
    </Editor>
    </Modal>
  );
});

export default KeywordEditor;
