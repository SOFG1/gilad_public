import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import { ISinglePost } from "../../store/posts";
import { Checkbox } from "../Checkbox";
import { Title } from "../Title";
import { IProps } from "./types";

const StyledTitle = styled(Title)`
  margin-top: 20px;
  margin-bottom: 15px;
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



const OpenedPostsComponent = React.memo(({openedPosts, usedPosts, onUsedPostSelect}: IProps) => {
    const { t } = useTranslation();
    const id = useId()
    return (
      <>
        <StyledTitle>{t("emails_used-posts")}</StyledTitle>
        {openedPosts.map((post: ISinglePost, index: number) => {
          const inputId = `${id} ${index}`;
          return (
            <CheckboxContainer key={post.id}>
              <Checkbox
                id={inputId}
                checked={usedPosts.hasOwnProperty(post._sender) && usedPosts[post._sender].includes(post.id)}
                setIsCheckedCreate={() => onUsedPostSelect(post._sender, post.id)}
              />
              <CheckboxLabel htmlFor={inputId}>
                {post.title || post.name}
              </CheckboxLabel>
            </CheckboxContainer>
          );
        })}
      </>
    );
  })

export default OpenedPostsComponent;
