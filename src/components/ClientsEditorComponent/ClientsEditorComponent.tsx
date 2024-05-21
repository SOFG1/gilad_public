import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ClientComponent } from "../ClientComponent";
import { ItemsBox } from "../ItemsBox";
import { TextInput } from "../TextInput";
import { Title } from "../Title";
import { IProps } from "./types";

const StyledInput = styled(TextInput)`
  margin-bottom: 20px;
  & input {
    padding: 10px 20px;
  }
  & input::placeholder {
    text-decoration: underline;
  }
`;


const StyledItem = styled(ClientComponent)<{
  isLoading: boolean;
}>`
  ${({ isLoading }) => isLoading && "cursor: wait;"}
`;

const ClientsEditorComponent = React.memo(
  ({
    searchClient,
    setSearchClient,
    clientElements,
    isLoading,
    onDeleteClient,
    onSetSelectedClient,
  }: IProps) => {
    const { t } = useTranslation();

  const handleSetSelected = (c: any) => {
    onSetSelectedClient(c)
  }

    return (
      <>
        <Title>{t("clients-editor_title2")}</Title>
        <StyledInput
          value={searchClient}
          onChange={setSearchClient}
          label={t("clients-editor_search-label")}
          searchBtn={true}
        />
        <ItemsBox>
          {clientElements.map((c: any) => (
            <StyledItem
            confirmDelMessage={t('clients_confirm-del')}
              isLoading={isLoading}
              onDelete={() => onDeleteClient(c.id)}
              onClick={() => handleSetSelected(c)}
              key={c.id}
            >
              {c.name}
            </StyledItem>
          ))}
        </ItemsBox>
      </>
    );
  }
);

export default ClientsEditorComponent;
