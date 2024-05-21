import React, { useState } from "react";
import styled from "styled-components";
import { TextInput } from "../TextInput";
import { IProps } from "./types";
import ShowIcon from "../../assets/svg/pass-show.svg";
import HideIcon from "../../assets/svg/pass-hide.svg";

const Wrapper = styled.div`
  position: relative;
`;

const Pic = styled.img`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  z-index: 2;
  margin-top: 10px;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: .65;
  }
`;

const PasswordInput = React.memo(({
  value,
  onChange,
  placeholder,
  label,
  className,
  required,
}: IProps) => {
    const [show, setShow] = useState<boolean>(false)
  return (
    <Wrapper className={className}>
      <Pic src={show ? HideIcon : ShowIcon} onClick={() => setShow((p) => !p)} />
      <TextInput
        isPassword={!show}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        label={label}
        required={required}
      />
    </Wrapper>
  );
});

export default PasswordInput;
