import React from "react";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import YesIcon from "../../assets/svg/yes.svg";
import NoIcon from "../../assets/svg/no.svg";
import { IProps } from "./types";
import { Modal } from "../Modal";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Modal)`
  width: auto;
  padding: 30px 50px;
`

const ButtonBlock = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
`;

const IconButton = styled.button`
  border: none;
  background-color: transparent;
  outline: none;
  margin: 0 6px;
  padding: 0;
  display: flex;
  align-content: center;
  align-items: center;
  transition: all 0.25s ease;
  justify-content: center;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 2px 2px rgba(34, 34, 34, 0.7));
  }
`;

const TextStyled = styled.p`
  font-size: 14px;
  color: ${colors.graphite_6} !important;
  text-align: center;
  margin: 0 0 10px;
  min-width: 140px;
`;

const ConfirmDelete = React.memo(({ onDelete, onClose, confirmMessage }: IProps) => {
  const {t} = useTranslation()

  return (
    <Wrapper onClose={onClose}>
      <TextStyled>{confirmMessage}</TextStyled>
      <ButtonBlock>
        <IconButton onClick={onDelete}>
          <img src={YesIcon} />
        </IconButton>
        <IconButton onClick={onClose}>
          <img src={NoIcon} />
        </IconButton>
      </ButtonBlock>
      </Wrapper>
  );
});

export default ConfirmDelete;
