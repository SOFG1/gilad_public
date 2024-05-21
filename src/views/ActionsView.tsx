import React from 'react'
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../assets/styles/colors";
import { MainButton } from "../components/MainButton";
import { useAppActions } from "../store/app/hooks";
import { useClientsState } from "../store/clients";
import { useUserState } from "../store/user/hooks";

const ActionsBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 70px;
  background: #ffffff;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.25);
`;

const ClientsTitle = styled.h2`
  font-family: "Gilroy-B";
  font-size: 24px;
  line-height: 30px;
  & > span {
    font-size: 28px;
    color: ${colors.orange};
    text-decoration: underline;
  }
`;

const ClientsBox = styled.div`
  display: flex;
  gap: 10px;
`;

const UsersBtn = styled(MainButton)`
  width: 186px;
`;

const ActionsView = React.memo(() => {
  const { t } = useTranslation();
  const { clients } = useClientsState();
  const { onSetModal } = useAppActions();
  const { is_staff } = useUserState();

  return (
    <ActionsBlock>
      <ClientsTitle>
        {t("clients_title1")} <span>{clients.length}</span>{" "}
        {t("clients_title2")}
      </ClientsTitle>
      <ClientsBox>
        <UsersBtn
          color="transparent"
          onClick={() => onSetModal("emails-history")}
        >
          {t("emails_send-history")}
        </UsersBtn>
        <MainButton color="blue" onClick={() => onSetModal("keyword-editor")}>
          {t("clients_edit-keywords")}
        </MainButton>
        <MainButton color="orange" onClick={() => onSetModal("client-editor")}>
          {t("clients_edit-clients")}
        </MainButton>
        {is_staff && (
          <UsersBtn color="transparent" onClick={() => onSetModal("add-user")}>
            {t("add-user_users")}
          </UsersBtn>
        )}
        <MainButton
          color="transparent"
          onClick={() => onSetModal("drafts")}
        >
          {t("drafts-drafts")}
        </MainButton>
        <MainButton
          color="transparent"
          onClick={() => onSetModal("bug_report")}
        >
          {t("bug_report-btn")}
        </MainButton>
      </ClientsBox>
    </ActionsBlock>
  );
});

export default ActionsView;
