import { current } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useId } from "react";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import { IProps } from "./types";
import FilePic from "../../assets/svg/attached-file.svg";
import AttachPic from "../../assets/svg/file-pic.svg";
import DelSvg from "../../assets/svg/createable-del.svg";
import { handle } from "../../api";
import { Posts } from "../../api/Posts";
import { useUserState } from "../../store/user/hooks";
import { Preloader } from "../Preloader";

const Wrapper = styled.label``;

const Input = styled.input`
  display: none;
`;

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

const FileThumb = styled.img`
  height: 14px;
  width: 14px;
  object-fit: contain;
  object-position: center;
`;

const AttachThumb = styled.img`
  height: 20px;
  width: 20px;
  object-fit: contain;
`;

const DelBtn = styled.button`
  height: 14px;
  width: 14px;
  padding: 0;
  background-color: transparent;
  border: 0;
  background-image: url(${DelSvg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: opacity 250ms linear;
  &:hover {
    opacity: 0.6;
  }
`;

const StyledPrelaoder = styled(Preloader)`
  text-align: start;
  span {
    height: 40px;
    width: 40px;
  }
`;

const FileInputFetch = React.memo(
  ({ className, filesList, onChange }: IProps) => {
    const { token } = useUserState();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const id = useId();

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (token) {
        setIsFetching(true);

        if (typeof e.target?.files?.length === "number") {
          const filesArr: { name: string; id: number }[] = [];
          for (let i = 0; i < e.target?.files?.length; i++) {
            const data = new FormData();
            data.append("file", e.target?.files[i]);
            const [dataRes, dataErr] = await handle(
              Posts.sendAttachment(data, token)
            );
            if (dataErr) return;
            if (dataRes) console.log(dataRes);
            filesArr.push({ name: dataRes.file_name, id: dataRes.id });
          }
          setIsFetching(false);
          onChange([...filesArr, ...filesList]);
        }
      }
    }

    const handleDelete = async (id: number) => {
      const [dataRes, dataErr] = await handle(
        Posts.deleteAttachment(id, token)
      );
      if (dataErr) console.log(dataErr);
      if (!dataErr) {
        const filtered = filesList.filter((f) => f.id !== id);
        onChange(filtered);
      }
    };

    return (
      <div className={className}>
        <Wrapper htmlFor={id}>
          <StyledBtn>
            <AttachThumb src={AttachPic} />
            Attach files
          </StyledBtn>
          <Input id={id} type="file" multiple={true} onChange={handleChange} value={""} />
        </Wrapper>
        {isFetching ? (
          <StyledPrelaoder />
        ) : (
          <FilesBox>
            {filesList.map((f) => {
              return (
                <StyledFile key={f.id}>
                  <FileThumb src={FilePic} />
                  {f.name}
                  <DelBtn onClick={() => handleDelete(f.id)} />
                </StyledFile>
              );
            })}
          </FilesBox>
        )}
      </div>
    );
  }
);

export default FileInputFetch;
