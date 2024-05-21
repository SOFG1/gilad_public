import React from 'react'
import { IModal } from "./types";
import styled from "styled-components";
import CloseIcon from '../../assets/svg/close-cross.svg'

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(20px);
  z-index: 1000;
`;

const Body = styled.div`
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 20px;
  max-width: 900px;
  width: 90vw;
  background-color: #fff;
  border: 1px solid #c2fffd;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.05);
`;

const DeleteBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  height: 20px;
  width: 20px;
  background-image: url(${CloseIcon});
  padding: 0;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: .65;
  }
`;

const Modal = React.memo(({
  children,
  onClose,
  className,
}: IModal): JSX.Element | null => {

  return (
    <ModalWrapper>
      <Body className={className}>
        <>
          <DeleteBtn onClick={onClose} />
          {children}
        </>
      </Body>
    </ModalWrapper>
  );
})

export default Modal;
