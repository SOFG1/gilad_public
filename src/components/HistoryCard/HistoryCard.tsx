import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../../assets/styles/colors";
import UserImg from "../../assets/svg/user-src.svg";
import { IHistoryEmail } from "../../store/posts";
import FileLogo from "../../assets/svg/attached-file.svg";
import { Title } from "../Title";
import { Button } from "../Button";
import { convertStringToDate, getFormatDateTime } from "../../utilites";

const FadeUp = keyframes`
    0%{
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const Card = styled.div`
  max-width: 1050px;
  background: #ffffff;
  border: 1px solid #c2fffd;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  animation: ${FadeUp} 350ms;
  transition: background 200ms linear;
  &:hover {
    background-color: rgba(0, 0, 77, 0.05);
    .dots {
      opacity: 1;
    }
    .inner_html::after {
      box-shadow: none;
    }
  }
`;

const Content = styled.div`
  padding: 20px;
  word-break: break-all;
`;

const StyledTitle = styled(Title)`
  text-align: start;
`;

const StyledButton = styled(Button)`
  flex-shrink: 0;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
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

const StyledDate = styled.p`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: ${colors.grey_4};
`;

const Text = styled.div`
  position: relative;
  height: 100px;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    transition: 200ms linear;
    box-shadow: inset 0 -20px 25px #ffffffee;
    z-index: 2;
  }
`;

const Dots = styled.p`
  font-size: 24px;
  font-weight: 500;
  line-height: 3px;
  transition: opacity 200ms linear;
  opacity: 0;
  margin-bottom: 8px;
`;

const ClientsBox = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  border-top: 1px solid #cccccc;
  padding: 20px;
`;

const ClientName = styled.p`
  text-decoration-line: underline;
  color: ${colors.graphite_4};
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

interface IProps {
  item: IHistoryEmail;
  onClick: () => void;
  onDelete?: () => void;
  onSend?: () => void;
}

const HistoryCard = React.memo(({ item, onClick, onDelete, onSend }: IProps) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onSend) onSend();
  };

  const date: string = useMemo(() => {
    if (item?.datetime) {
      const date = convertStringToDate(item?.datetime).getTime()
      const offset = new Date().getTimezoneOffset() * 60 * 1000;
      return  getFormatDateTime(new Date(date - offset))
    }
    return "";
  }, [item?.datetime]);

  return (
    <Card onClick={onClick}>
      <Content>
        <Box>
          <StyledTitle>{item.subject}</StyledTitle>
          {onDelete && <StyledButton type="del" onClick={handleDelete} />}
          {onSend && <StyledButton type="email" onClick={handleSend} />}
        </Box>
        <Box>
          <User>
            <UserPic src={UserImg} />
            <UserName>{item?.user_name}</UserName>
          </User>
          <StyledDate>{date}</StyledDate>
        </Box>
        <Text
          className="inner_html"
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
        <Dots className="dots">...</Dots>
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
      <ClientsBox>
        {item.clients.map((c) => (
          <ClientName key={c.id}>{c.name}</ClientName>
        ))}
      </ClientsBox>
    </Card>
  );
});

export default HistoryCard;
