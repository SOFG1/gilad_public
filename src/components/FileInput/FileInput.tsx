import React, { useId, useMemo, useState } from "react";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import { IProps } from "./types";
import AttachPic from "../../assets/svg/file-pic.svg";
import FilePic from "../../assets/svg/attached-file.svg";



const Wrapper = styled.label``;

const StyledBtn = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${colors.grey_4};
  padding: 5px 20px;
  border: 1px solid #999999;
  border-radius: 15px;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: 0.55;
  }
`;

const FilesBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
`;

const AttachThumb = styled.img`
  height: 20px;
  width: 20px;
  object-fit: contain;
`;

const Input = styled.input`
  display: none;
`;

const FileThumb = styled.img`
  height: 14px;
  width: 14px;
  object-fit: contain;
  object-position: center;
`;

const StyledFile = styled.p`
  display: flex;
  align-items: center;
  padding: 5px 7px;
  gap: 6px;
  font-size: 14px;
  line-height: 14px;
  color: ${colors.graphite_6};
  background: #ffffff;
  border: 1px solid #f06543;
  border-radius: 13px;
`;


const FileInput = React.forwardRef(({text, className,isMultiple, ...props}: IProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const [filesList, setFilesList] = useState<string[]>([])
    const id = useId();

    const onChange = () => {
      const list = []
      //@ts-ignore
      const files = ref.current.files
      if (files) {
        for(let i = 0; i < files.length; i++) {
          list.push(files[i].name)
        }
      }
      setFilesList(list)
    }
  
    return (
      <Wrapper htmlFor={id} className={className}>
        <StyledBtn>
          <AttachThumb src={AttachPic} />
          {text}
        </StyledBtn>
        <Input onChange={onChange} id={id} type="file" multiple={isMultiple} ref={ref} {...props} />
      <FilesBox>
        {filesList.map((f, i) => {
          return (
            <StyledFile key={i}>
              <FileThumb src={FilePic} />
              {f}
            </StyledFile>
          );
        })}
        </FilesBox>
      </Wrapper>
    );
  })

export default FileInput;
