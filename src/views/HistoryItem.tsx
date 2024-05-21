import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../assets/styles/colors";
import UserImg from "../assets/svg/user-src.svg";
import { ButtonBox } from "../components/ButtonBox";
import { MainButton } from "../components/MainButton";
import { Modal } from "../components/Modal";
import { useAppActions } from "../store/app/hooks";
import { IHistoryEmail } from "../store/posts";
import FileLogo from "../assets/svg/attached-file.svg";


const Content = styled.div`
  max-width: 1090px;
  width: 100%;
  height: calc(80vh - 90px);
  padding: 30px 20px 20px;
  overflow-y: auto;
  word-break: break-all;
`;

const Title = styled.h1`
  font-family: "Open Sans";
  font-weight: 700;
  font-size: 36px;
  line-height: 49px;
  margin-bottom: 20px;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 42px;

`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const UserPic = styled.img`
  height: 16px;
  width: 16px;
  object-fit: contain;
  object-position: center;
`;

const UserName = styled.p`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: ${colors.grey_4};
`;

const Date = styled.p`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: ${colors.grey_4};
`;

const ClientsTitle = styled.h4`
font-weight: 700;
font-size: 20px;
line-height: 25px;
margin-bottom: 10px;
`;

const ClientsBox = styled.div`
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    margin-bottom: 30px;
`;

const Client = styled.p`
line-height: 19px;
text-decoration-line: underline;
color: ${colors.graphite_4};
`;

const EmailInner = styled.div`
  margin-bottom: 15px;
`;

const FilesBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const File = styled.a`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid #f06543;
  border-radius: 13px;
  color: inherit;
  text-decoration: none;
  p {
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    width: 100px;
  }
`;

const FilePic = styled.img`
  height: 14px;
  width: 14px;
  object-fit: contain;
  object-position: center;
`;

const StyledBtn = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const HistoryItem = React.memo(({ item, onBack }: {onBack: () =>void, item: IHistoryEmail}) => {
  const { t } = useTranslation();
  const {onSetModal} = useAppActions()



  useEffect(() => {
    return () => onBack()
  }, [])

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Content>
        <Title>{item.subject}</Title>
        <Box>
          <User>
            <UserPic src={UserImg} />
            <UserName>{item.user_name}</UserName>
          </User>
          <Date>{item.datetime}</Date>
        </Box>
        <ClientsTitle>{t('emails_send-history_clients')}</ClientsTitle>
        <ClientsBox>
        {item.clients.map(c => <Client key={c.id}>{c.name}</Client>)}
        </ClientsBox>
        <EmailInner dangerouslySetInnerHTML={{__html: item.text}} />
        <FilesBox>
          {item.attachments.map((a) => {
            return (
              <File
                key={a.id}
                href={a.file}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <FilePic src={FileLogo} />
                <p>{a.file_name}</p>
              </File>
            );
          })}
        </FilesBox>
      </Content>
      <ButtonBox>
        <StyledBtn
          color="orange"
          onClick={onBack}
        >
          {t("emails_send-history_back")}
        </StyledBtn>
        <StyledBtn onClick={() => onSetModal(null)} color="blue">
          {t("emails_send-history_close")}
        </StyledBtn>
      </ButtonBox>
    </Modal>
  );
});

export default HistoryItem;
