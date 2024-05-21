import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../assets/styles/colors";
import { FilterClient, IMultiPost } from "../store/posts";
import SourceLogo from "../assets/svg/card-src.svg";
import { Button } from "../components/Button";
import { IClient, IPostCardClient } from "../store/clients";
import { useTranslation } from "react-i18next";

const FadeUp = keyframes`
    0%{
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const Card = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 20px;
  margin-bottom: 30px;
  transition: opacity 500ms linear;
  animation: ${FadeUp} 350ms;
  & * {
    word-break: break-all;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Clients = styled.div`
  padding: 20px;
  flex-shrink: 0;
  width: 135px;
  border-inline-start: 1px solid #cccccc;
`;

const Title = styled.h2`
  font-family: "Gilroy-R";
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 10px;
`;

const Source = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${colors.grey_4};
`;

const StyledInnerPosts = styled.p`
  margin-bottom: 10px;
`

const SourceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SourcePic = styled.img`
  height: 16px;
  width: 16px;
  object-fit: contain;
  object-position: center;
`;

const Client = styled.p<{ sended: boolean }>`
  margin-bottom: 8px;
  text-decoration: underline;
  color: ${({ sended }) => (sended ? "green" : colors.graphite_4)};
  cursor: pointer;
  transition: opacity 250ms linear;
  word-break: break-all;
  &:hover {
    opacity: 0.65;
  }
`;

interface IProps {
  item: IMultiPost;
  onEmail: () => void;
  onSelectClient: (client: FilterClient) => void;
}

const MultiPostCard = React.memo(({ item, onEmail, onSelectClient }: IProps) => {
  const {t} = useTranslation()
  const cat = useMemo(() => {
    //take 'cat' of the first post(it is the same in all posts of this multipost)
    return item.posts[0].cat;
  }, [item]);

  const tag = useMemo(() => {
    //take 'tag' of the first post(it is the same in all posts of this multipost)
    return item.posts[0].tag;
  }, [item]);
  
  

  return (
    <Card>
      <Content>
        <Title>{item.title}</Title>
        <Source>
          {tag && (
            <SourceBox>
              <SourcePic src={SourceLogo} />
              {tag}
            </SourceBox>
          )}
          {cat && <p>{cat}</p>}
        </Source>
        <StyledInnerPosts>{t('post-card_inner-posts')} {item.posts.length}</StyledInnerPosts>
        <Button type="email" onClick={() => onEmail()} />
      </Content>
      <Clients>
      {
          item.clients.map((client: IPostCardClient, index: number) => (
            <Client
              sended={client.sended}
              onClick={() =>
                onSelectClient({ id: client.id, client: client.name })
              }
              key={index}
            >
              {client.name}
            </Client>
          ))}
      </Clients>
    </Card>
  );
});

export default MultiPostCard;
