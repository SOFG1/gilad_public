import React, { useCallback, useState } from "react";
import { IProps } from "./types";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import closePic from "../../assets/svg/keyword-del.svg";
import { ConfirmDelete } from "../ConfirmDelete";

const Keyword = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 5px 4px 7px;
  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  border-radius: 13px;
`;

const DeleteBtn = styled.div`
  position: relative;
  height: 14px;
  width: 14px;
  background-image: url(${closePic});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: 250ms linear;
  cursor: pointer;
`;

const Text = styled.p<{ clickable: Function | undefined }>`
  font-size: 14px;
  line-height: 17px;
  color: ${colors.graphite_6};
  ${({ clickable }) =>
    clickable &&
    `
transition: 150ms linear;
cursor: pointer;
&:hover {
  opacity: 0.45;
}`}
`;

const PostKeyword = React.memo(({ children, onClick, onDelete, confirmDelMessage, className }: IProps) => {
  const [showWarining, setShowWarning] = useState<boolean>(false);

  const handleBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowWarning(true);
  };

  const handleDelete = useCallback(() => {
    setShowWarning(false)
    if(onDelete) onDelete()
  }, [])

  return (
    <Keyword className={className}>
      <Text clickable={onClick} onClick={onClick}>
        {children}
      </Text>
      {onDelete && (
        <>
          {showWarining && (
            <ConfirmDelete
              confirmMessage={confirmDelMessage}
              onDelete={handleDelete}
              onClose={() => setShowWarning(false)}
            />
          )}
          <DeleteBtn onClick={handleBtnClick} />
        </>
      )}
    </Keyword>
  );
});

export default PostKeyword;
