import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { IKeyword } from "../../store/keywords";
import { DropdownSearch } from "../DropdownSearch";
import { ItemsBox } from "../ItemsBox";
import { PostKeyword } from "../PostKeyword";
import { Title } from "../Title";
import { IProps } from "./types";

const KeywordsDropdown = styled(DropdownSearch)`
  margin-bottom: 20px;
  & * {
    cursor: pointer !important;
  }
`;


const StyledItem = styled(PostKeyword)<{
  isLoading: boolean;
}>`
  ${({ isLoading }) => isLoading && "cursor: wait;"}
`;

const KeywordsEditorComponent = React.memo(
  ({ keywordsOptions, addKeyword, selectedKeywords, setSelectedKeywords, isLoading }: IProps) => {
    const { t } = useTranslation();
    
    return (
      <>
        <Title>{t("keyword-editor_title2")}</Title>
        <KeywordsDropdown
          options={keywordsOptions}
          value={{ label: t("clients-editor_add-keyword"), value: "" }}
          onSelect={addKeyword}
        />
        <ItemsBox>
          {selectedKeywords.map((k: IKeyword) => (
            <StyledItem
              confirmDelMessage={t('keywords_confirm-del')}
              isLoading={isLoading}
              onDelete={() =>
                setSelectedKeywords((prev: IKeyword[]) => prev.filter((p) => p.id !== k.id))
              }
              key={k.id}
            >
              {k.keyword}
            </StyledItem>
          ))}
        </ItemsBox>
      </>
    );
  }
);

export default KeywordsEditorComponent;
