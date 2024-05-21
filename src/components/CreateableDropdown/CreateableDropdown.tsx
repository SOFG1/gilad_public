import React, { useCallback, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { CreatableEditableSelectValue, Props } from "./types";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import DelIco from '../../assets/svg/createable-del.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .createable {
  &__control {
    border: 1px solid #d0d9de !important;
    box-shadow: inset 0px 4px 15px rgba(0, 0, 0, 0.05) !important;
    border-radius: 20px !important;
    padding: 9px 17px !important;
    min-height: 90px;
    align-items: flex-start !important;
  }
  &__control--is-focused {
    border: #000 solid 2px !important;
  }

  &__multi-value {
    padding: 5px !important;
    border-radius: 13px !important;
    background: #ffffff !important;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15) !important;
    align-items: center;
  }
  &__multi-value button {
    padding: 0;
    border: 0;
    border-radius: 0;
    background-color: transparent;
  }
  &__multi-value input {
    width: 80px;
  }
  &__multi-value__remove {
    height: 14px;
    width: 14px;
    background-image: url(${DelIco});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin-inline-start: 3px;
    cursor: pointer;
    transition: opacity 250ms linear;
  }
  &__multi-value__remove:hover {
    opacity: .6;
    background-color: transparent !important;
  }
  &__multi-value__remove svg {
    display: none;
  }

  &__indicators {
    display: none !important;
  }
}
`;

const LabelStyled = styled.label`
  margin-inline-start: 20px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.graphite_5};
`;

const CreateableDropdown = React.memo( ({
  options,
  value: propValue,
  onChange,
  className,
  placeholder,
  label,
}: Props) => {
  const [editingValue, setEditingValue] = useState<string>();

  const handleChange = useCallback(
    (newValue: CreatableEditableSelectValue[]) => {
      onChange(newValue);
    },
    [onChange]
  );

  const handleEditChange = useCallback(
    (inputValue: string, data: CreatableEditableSelectValue) => {
      const idx = propValue.findIndex((v) => v.value === data.value);
      const newValue = [...propValue];

      if (inputValue.length === 0) {
        newValue.splice(idx, 1);
      } else {
        newValue[idx] = {
          label: inputValue,
          value: inputValue,
        };
      }

      onChange(newValue);

      setEditingValue(undefined);
    },
    [propValue, onChange]
  );

  const MultiValueLabel = useCallback(
    ({ data }: { data: CreatableEditableSelectValue }) => {
      if (editingValue && editingValue === data.value) {
        return (
          <input
            type="text"
            defaultValue={data.value}
            onKeyDown={(ev) => {
              ev.stopPropagation();
              if (ev.key === "Enter") {
                handleEditChange(ev.currentTarget.value, data);
              }
            }}
            onBlur={(ev) => {
              handleEditChange(ev.currentTarget.value, data);
            }}
            autoFocus
          />
        );
      }
      return (
        <button
          onClick={() => {
            setEditingValue(data.value);
          }}
        >
          {data.value}
        </button>
      );
    },
    [handleEditChange, editingValue]
  );

  //Check styles in assets/styles/_createabledropdown.scss
  return (
    <Wrapper className={className}>
      {label && <LabelStyled>{label}</LabelStyled>}
      <CreatableSelect
        isMulti
        placeholder={placeholder}
        className="createable"
        classNamePrefix="createable"
        isClearable={false}
        value={propValue}
        //@ts-ignore
        onChange={handleChange}
        options={options}
        components={{
          MultiValueLabel,
        }}
      />
    </Wrapper>
  );
});

export default CreateableDropdown;
