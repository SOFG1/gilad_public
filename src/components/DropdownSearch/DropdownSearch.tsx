import React from 'react'
import Select from "react-select";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";

interface IProps {
  label?: string;
  options: { label: string; value: string }[];
  value: any;
  isMulti?: boolean;
  className?: string;
  isReversed?: boolean;
  onSelect: (v: any) => void;
  components?: any
}

const StyledDropdown = styled.div`
  //width: 100%;
`;

const LabelStyled = styled.label`
  margin-inline-start: 20px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.graphite_5};
`;

const customStyles = {
  indicatorSeparator: () => {
    return {
      display: "none",
    };
  },
  control: (provided: any) => {
    return {
      ...provided,
      padding: "3px 0",
      background: "#fff",
      border: "1px solid #D0D9DE",
      boxSizing: "border-box",
      boxShadow: "inset 0 4px 15px rgb(0 0 0 / 5%)",
      borderRadius: "20px",
      transition: "all .25s ease",
      fontSize: "18px",
      wordBreak: "break-word",
      minHeight: "40px",
      color: "#455B66",
      marginTop: "5px",
      cursor: "pointer",
    };
  },
  menu: (provided: any) => {
    return {
      ...provided,
      padding: "7px 0",
      border: "1px solid #D0D9DE",
      boxSizing: "border-box",
      boxShadow: "inset 0 4px 15px rgb(0 0 0 / 5%)",
      borderRadius: "20px",
    }
  },
  menuList: (provided: any) => {
    return {
      ...provided,
      minHeight: "300px"
    }
  }
};

const DropdownSearch = React.memo(({
  options,
  value,
  onSelect,
  isMulti,
  className,
  label,
  isReversed,
  components
}: IProps) => {  
  return (
    <StyledDropdown className={className}>
      {label !== "" && <LabelStyled>{label}</LabelStyled>}
      <Select
        menuPlacement={isReversed ? "top" : "bottom"}
        className="searchable-dropdown"
        styles={customStyles}
        onChange={(e) => onSelect(e)}
        value={value}
        options={options}
        isMulti={isMulti}
        isRtl={true}
        placeholder=""
        isClearable={false}
        components={components}
      />
    </StyledDropdown>
  );
});

export default DropdownSearch;
