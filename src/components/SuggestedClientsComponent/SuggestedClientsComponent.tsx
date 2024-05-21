import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import { selectCheckbox } from "../../utilites/selectCheckbox";
import { Checkbox } from "../Checkbox";
import { IProps } from "./types";

const StyledSuggestedClients = styled.div`
  height: 120px;
  overflow-y: auto;
`;

const SelectorLabel = styled.p`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4;
  color: ${colors.graphite_5};
  margin-bottom: 5px;
`;

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0 10px 15px 0;
`;

const CheckboxLabel = styled.label`
  font-family: "Gilroy-R", sans-serif;
  font-size: 16px;
  line-height: 19px;
  text-decoration-line: underline;
  color: ${colors.graphite_4};
`;

const SuggestedClientsComponent = React.memo(
  ({ suggestedClients, selectedClients, onChange }: IProps) => {
    const { t } = useTranslation();
    const id = useId();
    return (
      <>
        {suggestedClients.length > 0 && (
          <SelectorLabel>{t("emails_suggested-clients")}</SelectorLabel>
        )}
        <StyledSuggestedClients>
          {suggestedClients.map((client: any, index: number) => {
            const inputId = `${id} ${index}`;
            return (
              <CheckboxContainer key={client.id}>
                <Checkbox
                  id={inputId}
                  checked={selectedClients.includes(client.id)}
                  setIsCheckedCreate={() =>
                    onChange(selectCheckbox(client.id, selectedClients))
                  }
                />
                <CheckboxLabel htmlFor={inputId}>{client.name}</CheckboxLabel>
              </CheckboxContainer>
            );
          })}
        </StyledSuggestedClients>
      </>
    );
  }
);

export default SuggestedClientsComponent;
