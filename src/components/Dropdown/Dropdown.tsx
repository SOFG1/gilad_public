import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RowItem from "./RowItem";
import arrow from "../../assets/svg/drop-arrow.svg";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import _ from "lodash";
import {DropdownProps} from './types'

const DropdownStyled = styled.div<{isDisabled?: boolean}>`
  position: relative;
  width: 100%;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  align-items: flex-start;
  justify-content: flex-start;
  ${({isDisabled}) => isDisabled && '& * {cursor: not-allowed;}'}
`;
const RowItemStyled = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 0;
`;

const IconStyled = styled.img<{rtl: boolean}>`
  height: 6px;
  width: 12px;
  margin-inline-start: 8px;
  position: absolute;
  top: 50%;
  ${({rtl}) => rtl ? 'left' : 'right'}: 17px;
  transform: translateY(-50%);
`;

const Menu = styled.div<{ showMenu: boolean, isReversed: boolean | undefined }>`
  visibility: ${({ showMenu }) => (showMenu ? "visible" : "hidden")};
  background-color: #fff;
  border-radius: 1rem;
  border: 1px solid ${colors.graphite_1};
  position: absolute;
  ${({isReversed}) => (isReversed ? 'bottom' : 'top') + ': 100%;'}
  left: 0;
  right: 0;
  width: 100%;
  transition: all 0.25s ease-out;
  opacity: ${({ showMenu }) => (showMenu ? 1 : 0)};
  z-index: 100;
  height: ${({ showMenu }) => (showMenu ? "fit-content" : 0)};
  max-height: 300px;
  overflow-y: auto;

  & > div {
    border-radius: 0;

    &:first-child {
      border-radius: 1rem 1rem 0 0;
    }

    &:last-child {
      border-radius: 0 0 1rem 1rem;
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
  margin-bottom: 5px;
`;

const Dropdown = React.memo(({
  value,
  placeholder,
  onSelect,
  label,
  options,
  isSmall,
  disabledValues,
  isDisabled,
  menuChild,
  isMultiSelect,
  isReversed,
  className,
  ...props
}: DropdownProps) => {
  const dropdown = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Array<string | number>>(
    []
  );

  // Set dropdown values when value from props changes
  useEffect(() => {
    if (typeof value === 'string') {
      let newItems = value.split(', ')
      if (!newItems[0]) newItems = []
      let selectedIds = newItems.map(id => parseInt(id ,10))
      if(selectedItems.length !== selectedIds.length) {
        setSelectedItems(selectedIds)
      }
    }
  }, [value])


  const selectItem = useMemo(() => {
    if (!isMultiSelect) {
      return options.filter((item) => item.value == value)[0] || null;
    } else {
      const arr = String(value).split(", ");
      return (
        options.filter(
          (item) =>
            _.includes(arr, String(item.value)) ||
            _.includes(arr, String(item.item))
        ) || []
      );
    }
  }, [options, value]);

  const handleClickOutside = useCallback((e: any) => {
    if (!e.composedPath()?.includes(dropdown.current)) {
      setShowMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (isMultiSelect) {
      onSelect(selectedItems.join(", "));
    }
  }, [selectedItems]);

  const onSelectHandler = useCallback(
    (val: string | number) => {
      if (isMultiSelect) {
        setSelectedItems((prevState) => {
          if (_.includes(prevState, val)) {
            return [...prevState.filter((item) => item !== val)];
          } else {
            return [...prevState, val];
          }
        });
      } else {
        onSelect(val);
        setShowMenu(false);
      }
    },
    [onSelect, setSelectedItems]
  );

  const [selectItemItem, selectItemValue] = useMemo(() => {
    if (selectItem) {
      if (Array.isArray(selectItem)) {
        if (selectItem.length > 0) {
          const item = selectItem.map((item) => item.item).join(", ");
          const value = selectItem.map((item) => item.value).join(", ");
          return [item, value];
        } else {
          return [placeholder, "-"];
        }
      } else {
        return [selectItem.item, selectItem.value];
      }
    } else {
      return [placeholder, "-"];
    }
  }, [selectItem, isMultiSelect, placeholder]);

  const onToggleShow = useCallback(() => {
    if (!isDisabled) {
      setShowMenu(!showMenu);
    }
  }, [isDisabled, showMenu]);

  return (
    <DropdownStyled ref={dropdown} isDisabled={isDisabled} className={className} {...props}>
      {label !== "" && <LabelStyled>{label}</LabelStyled>}

      <RowItemStyled onClick={onToggleShow}>
        {selectItem ? (
          <RowItem
            isSmall={isSmall === true}
            onShow={onToggleShow}
            isSelected={false}
            isActive={true}
            item={selectItemItem}
            value={selectItemValue}
          />
        ) : (
          <RowItem
            isSmall={isSmall === true}
            onShow={onToggleShow}
            isSelected={false}
            isActive={true}
            item={placeholder}
            value={"-"}
          />
        )}
        <IconStyled rtl={document.body.dir === 'rtl'} src={arrow} />
        <Menu showMenu={showMenu} isReversed={isReversed}>
        {menuChild !== undefined && menuChild}
        {options.map((opt, id) => {
          const isSelected =
            (disabledValues !== undefined &&
              _.includes(disabledValues, opt.value)) ||
            (Array.isArray(selectItem)
              ? _.includes(
                  String(selectItemValue).split(", "),
                  String(opt.value)
                )
              : selectItem?.value === opt.value);

          return (
            <RowItem
              isSmall={isSmall === true}
              isActive={false}
              isSelected={isSelected}
              key={`Dropdown-${id}`}
              isMultiSelect={isMultiSelect}
              onSelect={onSelectHandler}
              item={opt.item}
              value={opt.value}
            />
          );
        })}
      </Menu>
      </RowItemStyled>
    </DropdownStyled>
  );
})

export default Dropdown;
