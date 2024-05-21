import React, { useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../assets/styles/colors";
import { PostKeyword } from "../components/PostKeyword";
import { Button } from "../components/Button";
import SourceLogo from "../assets/svg/card-src.svg";
import { useTranslation } from "react-i18next";
import { usePostsActions } from "../store/posts/hooks";
import { IPostCardClient } from "../store/clients";
import deleteCrossIco from "../assets/svg/createable-del.svg";
import { formatDate } from "../utilites";
import { FilterClient, ISinglePost } from "../store/posts";
import downloadCalendarEvent from "../utilites/downloadCalendarEvent";
import sentIcon from "../assets/svg/yes.svg"


const FadeUp = keyframes`
    0%{
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const Card = styled.div<{ isViewed: boolean | undefined }>`
position: relative;
  display: flex;
  background-color: #fff;
  border-radius: 20px;
  margin-bottom: 30px;
  transition: opacity 500ms linear;
  animation: ${FadeUp} 350ms;
  ${({ isViewed }) => !isViewed && "background-color: #e9fffe;"}
  & * {
    word-break: break-all;
  }
`;

const SentIcon = styled.img`
  position: absolute;
  bottom: 10px;
  inset-inline-end: 10px;
`

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

const Title = styled.h2`
  font-family: "Gilroy-R";
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 10px;
  white-space: pre-wrap;
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

const StyledCommittee = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${colors.grey_4};
  margin: 0;
  margin-inline-start: auto;
  margin-bottom: 5px;
`

const HoverLink = styled.a`
  color: inherit;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: 0.65;
  }
`;

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


const Text = styled.p`
  font-family: "Open Sans";
  font-size: 18px;
  line-height: 25px;
  margin-bottom: 20px;
  word-break: break-all;
`;

const KeywordsTitle = styled.p`
  font-size: 18px;
  line-height: 22px;
  /* graphite5 */
  color: ${colors.graphite_5};
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StyledDate = styled.p`
  margin-top: 18px;
`;

const StyledCommitteeName = styled.p`
  margin: 0 0 5px;
`

const StyledDeleteCross = styled.button`
  height: 14px;
  width: 14px;
  padding: 0;
  border: 0;
  background-color: transparent;
  background-image: url(${deleteCrossIco});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: 0.65;
  }
`;

interface IProps {
  onEmail: () => void;
  item: ISinglePost;
  onSelectClient: (client: FilterClient) => void;
}

const SinglePostCard = React.memo(({
  onEmail,
  onSelectClient,
  item,
}: IProps) => {
  const { t } = useTranslation();
  const { onDeletePost, onDeletePostKeyword } = usePostsActions();
  const sortDate = useMemo(() => {
    if (item.date_for_sorting) {
      var d = new Date(item.date_for_sorting * 1000);
      return formatDate(d);
    }
    if (!item.date_for_sorting) return null;
  }, [item.date_for_sorting]);




  const isCommitteeSession = useMemo(() => {
    return item._sender === "committee_session"
  }, [item._sender])

  const tagLink = useMemo(() => {
    let tempLink = "";
    if (item.first_link) tempLink = item.first_link;
    if (item.url) tempLink = item.url;
    if (item.link_to_submission) tempLink = item.link_to_submission;
    if (item.link) tempLink = item.link;
    if (item.inner_link) tempLink = item.inner_link;
    if (item.front_link) tempLink = item.front_link;
    if (item.source_link_app_agenda) tempLink = item.source_link_app_agenda;
    if (item.committee_link) tempLink = item.committee_link;
    const label = item.tag ? item.tag : item.source_name;
    if (tempLink)
      return (
        <HoverLink target="_blank" href={tempLink}>
          {label}
        </HoverLink>
      );
    return label;
  }, [
    item
  ]);

  const titleComposed = useMemo(() => {
    if (item.tag !== "סל התרופות") return item.title;
    return `${item.title} - ${item.inner_link_name}`;
  }, [item]);

  const handleDeleteKeyword = useCallback((keywordId: number) => {
    onDeletePostKeyword(item._sender, item.id, keywordId)
  }, [item._sender, item.id])

  const handleCreateClendarEvent = useCallback(() => {
    downloadCalendarEvent(item.start_date, `${item.title || ""} ${item.title_sufix || ""}`, item.committee, item.location)
  }, [item])

  const committee = useMemo(() => {
    return item.committee || item.committee_name
  }, [item])

  return (
    <Card isViewed={item._viewed}>
      {item.sended && <SentIcon src={sentIcon} />}
      <Content>
        <StyledDeleteCross
          onClick={() => onDeletePost({ node: item._sender, postId: item.id })}
        />
        {titleComposed && <Title>{titleComposed}</Title>}
        {item.name && <Title>{item.name}</Title>}
        {isCommitteeSession && <StyledCommitteeName>{item.committee}</StyledCommitteeName>}
        {isCommitteeSession && <StyledCommitteeName>{item.title_sufix}</StyledCommitteeName>}
        {isCommitteeSession && <StyledCommitteeName>{item.start_date}</StyledCommitteeName>}

        <Source>
          {tagLink && (
            <SourceBox>
              <SourcePic src={SourceLogo} />
              {tagLink}
            </SourceBox>
          )}
          {item.cat && <p>{item.cat}</p>}
        </Source>
        {item.description && <Text>{item.description}</Text>}
        {item.text && <Text>{item.text}</Text>}
        <Btns>
          {item.keywords && <KeywordsTitle>{t("emails_keywords")}</KeywordsTitle>}
          {committee && <StyledCommittee>{committee}</StyledCommittee>}
        </Btns>
        {item.keywords && (
            <Keywords>
              {item.keywords.map(
                (keyword: { keyword: string; id: number }, index: number) => (
                  <PostKeyword confirmDelMessage="Are you sure ?" onDelete={() => handleDeleteKeyword(keyword.id)} key={index}>{keyword.keyword}</PostKeyword>
                )
              )}
            </Keywords>
        )}
        <Btns>
          <Button type="email" onClick={() => onEmail()} />
          {isCommitteeSession && (
            <Button
              type="calendar"
              onClick={handleCreateClendarEvent}
            />
          )}
          <Button
            type="del"
            onClick={() => onDeletePost({ node: item._sender, postId: item.id })}
          />
        </Btns>
        {sortDate && (
          <StyledDate>
            {t("post-card_sort-date")} {sortDate}
          </StyledDate>
        )}
      </Content>
      <Clients>
        {
          item.clients?.map((client: IPostCardClient, index: number) => (
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
})

export default SinglePostCard;
