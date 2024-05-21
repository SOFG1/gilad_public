import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../assets/styles/colors";
import { AddButton } from "../components/AddButton";
import { CreateableDropdown } from "../components/CreateableDropdown";
import { CreatableEditableSelectOption } from "../components/CreateableDropdown/types";
import { MainButton } from "../components/MainButton";
import { TextInput } from "../components/TextInput";
import { useClientsActions, useClientsState } from "../store/clients";
import { Title } from "../components/Title";
import { ButtonBox } from "../components/ButtonBox";
import { useKeywordsState } from "../store/keywords/hooks";
import { Modal } from "../components/Modal";
import { useAppActions } from "../store/app/hooks";
import { ClientsEditorComponent } from "../components/ClientsEditorComponent";
import { KeywordsEditorComponent } from "../components/KeywordsEditorComponent";

const Editor = styled.div<{ isLoading: boolean }>`
  ${({ isLoading }) => isLoading && "& * {cursor: wait !important;"}
`;

const Content = styled.div`
  padding: 40px 30px 30px;
`;

const ClientsBox = styled.div`
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

const StyledCreateableDropdown = styled(CreateableDropdown)`
  flex-grow: 1;
`;

const StyledBtn = styled(AddButton)`
  margin-top: 22px;
  flex-shrink: 0;
`;

const StyledClear = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
  flex-shrink: 0;
  margin-inline-start: auto;
  align-self: center;
  margin-inline-end: 15px;
`;

const StyledAction = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const StyledMessage = styled.p<{isErr: boolean}>`
  text-align: center;
  font-size: 17px;
  color: ${({isErr}) => isErr ? colors.red : 'green'};
  margin-bottom: 5px;
`;

const ClientsEditor = React.memo(() => {
  //Global State
  const { t } = useTranslation();
  const { onSetModal } = useAppActions();
  const { clients, isLoading, errorMessage, successMessage, selectedClient } =
    useClientsState();
  const { keywords } = useKeywordsState();
  const {
    onAddClient,
    onEditClient,
    onDeleteClient,
    onSetErrorMessage,
    onSetSuccessMessage,
    onSetSelectedClient,
  } = useClientsActions();
  const [name, setName] = useState<string>("");
  const [emails, setEmails] = useState<CreatableEditableSelectOption[]>([]);
  const [searchClient, setSearchClient] = useState<string>("");
  //Search regex
  const defferedSearchClient = useDeferredValue(searchClient);
  const clientRegex = useMemo(() => {
    return new RegExp(defferedSearchClient, "i");
  }, [defferedSearchClient]);


  // selected client's keywords' ids
  const [selectedKeywords, setSelectedKeywords] = useState<
    { id: number; keyword: string }[]
  >([]);

  //Clear error on closing
  useEffect(() => {
    return () => {
      onSetErrorMessage(null);
      onSetSuccessMessage(null)
      onSetSelectedClient(null);
    };
  }, []);

  //Fill fileds when selected changes
  useEffect(() => {
    if (selectedClient?.name) setName(selectedClient.name);
    if (selectedClient?.email) {
      setEmails(selectedClient.email.map((e) => ({ label: e, value: e })));
    }
    if (!selectedClient?.email) setEmails([]);
    if (selectedClient?.keywords) {
      setSelectedKeywords(selectedClient.keywords);
    }
    if (!selectedClient?.keywords) {
      setSelectedKeywords([]);
    }
  }, [selectedClient]);

  const handleAddClient = () => {
    onSetSelectedClient(null);
    const client = {
      name,
      team: "",
      keywords: [],
      email: emails.map((e) => e.value),
    };
    if (client.name && client.email && client.email.length > 0) {
      onAddClient(client);
      setName("");
      setEmails([]);
    } else {
      onSetErrorMessage(t("clients_name-email-empty"));
      setTimeout(() => {
        onSetErrorMessage(null);
      }, 5000);
    }
  };

  const handleEditClient = () => {
    if (selectedClient) {
      const newData = {
        id: selectedClient.id,
        name,
        team: "",
        keywords: selectedKeywords.map((k) => k.id),
        email: emails.map((e) => e.value),
      };
      onEditClient(newData);
    }
  };

  const handleClear = () => {
    setName("");
    setEmails([]);
    onSetSelectedClient(null);
  };

  const handleDeleteClient = (id: number) => {
    onSetErrorMessage(null)
    onSetSuccessMessage(null)
    onDeleteClient(id)
  }

  const handleAddkeyword = (newWord: any) => {
    if (!selectedKeywords.some((k) => k.id === parseInt(newWord.value, 10))) {
      setSelectedKeywords((p) => [
        ...p,
        { keyword: newWord.label, id: parseInt(newWord.value, 10) },
      ]);
    }
  };

  const clientElements = useMemo(() => {
    return defferedSearchClient
      ? clients.filter((c) => {
          return clientRegex.test(c.name);
        })
      : clients;
  }, [clients, clientRegex]);

  const keywordsOptions = useMemo(() => {
    const filtered = keywords
      .filter((keyword) => selectedKeywords.every((k) => k.id !== keyword.id))
      .map((k) => ({
        label: k.keyword,
        value: String(k.id),
      }));
    return filtered;
  }, [keywords, selectedKeywords]);

  

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Editor isLoading={isLoading}>
        <Content>
          <Title>{t("clients-editor_title1")}</Title>
          {successMessage && <StyledMessage isErr={false}>{successMessage}</StyledMessage>}
          {errorMessage && <StyledMessage isErr={true}>{errorMessage}</StyledMessage>}

          <ClientsBox>
            <StyledInput
              value={name}
              onChange={setName}
              placeholder={t("clients-editor_name-plhr")}
              label={t("clients-editor_name-label")}
            />
            <StyledCreateableDropdown
              options={[]}
              value={emails}
              onChange={setEmails}
              placeholder={t("clients-editor_email-plhr")}
              label={t("clients-editor_email-label")}
            />
            {selectedClient ? (
              <StyledClear onClick={handleClear} color="blue" type="reset">
                Clear
              </StyledClear>
            ) : (
              <StyledBtn onClick={handleAddClient} disabled={isLoading} />
            )}
          </ClientsBox>

          {!selectedClient && (
            <ClientsEditorComponent
              searchClient={searchClient}
              setSearchClient={setSearchClient}
              clientElements={clientElements}
              isLoading={isLoading}
              onDeleteClient={handleDeleteClient}
              onSetSelectedClient={onSetSelectedClient}
            />
          )}
          {selectedClient && (
            <KeywordsEditorComponent
              keywordsOptions={keywordsOptions}
              addKeyword={handleAddkeyword}
              selectedKeywords={selectedKeywords}
              setSelectedKeywords={setSelectedKeywords}
              isLoading={isLoading}
            />
          )}
        </Content>
        <ButtonBox>
          <StyledAction
            onClick={handleEditClient}
            color="orange"
            disabled={isLoading || !selectedClient}
          >
            {t("clients-editor_save")}
          </StyledAction>
          <StyledAction onClick={() => onSetModal(null)} color="blue">
            {t("clients-editor_close")}
          </StyledAction>
        </ButtonBox>
      </Editor>
    </Modal>
  );
});

export default ClientsEditor;
