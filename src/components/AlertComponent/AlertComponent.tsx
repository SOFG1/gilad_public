import React from "react";
import styled from "styled-components";
import { Modal } from "../Modal";
import { IProps } from "./types";
import successIcon from "../../assets/svg/success-icon.svg";
import errorIcon from "../../assets/svg/error-icon.svg";
import { useTranslation } from "react-i18next";

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #c2fffd;
  box-shadow: 0px 8px 25px rgb(0 0 0 / 5%);
`;

const Message = styled.p<{ isSuccess: boolean }>`
  color: ${({ isSuccess }) => (isSuccess ? "green" : "red")};
  text-align: center;
`;

const AlertComponent = React.memo(({ isSuccess, onClose, message }: IProps) => {
    const { t } = useTranslation();
    return (
      <Modal onClose={onClose}>
        <MessageWrapper>
          <img src={isSuccess ? successIcon : errorIcon} />
          <div>
            {message &&<Message  isSuccess={isSuccess}>{t(message)}</Message>}
          </div>
        </MessageWrapper>
      </Modal>
    );
  })

export default AlertComponent;
