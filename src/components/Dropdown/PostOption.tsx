import React from 'react'
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import SourceLogo from "../../assets/svg/card-src.svg";

const StyledOption = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ isSelected }) =>
  isSelected ? colors.graphite_3 : colors.white};
  border: 1px solid ${colors.graphite_1};
  box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  font-size: 18px;
  line-height: 22px;
  min-height: 60px;
  padding: 12px 17px;
  cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
  color: ${({ isSelected }) => (isSelected ? colors.white : colors.graphite_5)};
  &:hover {
    background-color: ${({isSelected}) => isSelected ? colors.graphite_3 : colors.graphite_1};
  }
`;

const StyledName = styled.p`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const Source = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  // color: ${colors.grey_4};
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

const PostOption = React.memo(({ data, innerProps, isSelected, ...props }: any) => {
  return (
    <StyledOption isSelected={isSelected} {...innerProps}>
      <Source>
        {(data.tag || data.source_name) && (
          <SourceBox>
            <SourcePic src={SourceLogo} />
            {data.tag || data.source_name}
          </SourceBox>
        )}
        {data.cat && <p>{data.cat}</p>}
      </Source>
      <StyledName>{data.label}</StyledName>
    </StyledOption>
  );
});

export default PostOption;
