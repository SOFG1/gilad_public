import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../assets/styles/colors";
import { AddButton } from "../components/AddButton";
import { ButtonBox } from "../components/ButtonBox";
import { Dropdown } from "../components/Dropdown";
import { ItemsBox } from "../components/ItemsBox";
import { MainButton } from "../components/MainButton";
import { Modal } from "../components/Modal";
import { PostKeyword } from "../components/PostKeyword";
import { TextInput } from "../components/TextInput";
import { Title } from "../components/Title";
import { useAppActions } from "../store/app/hooks";
import {
  IAddBirthday,
  IBirthDay,
  useBirthdaysActions,
  useBirthdaysState,
} from "../store/birthdays";

const Editor = styled.div<{ isLoading: boolean }>`
  ${({ isLoading }) => isLoading && "& * {cursor: wait !important;"}
`;

const Content = styled.div`
  padding: 40px 30px 30px;
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 20px;
`;

const StyledTextInput = styled(TextInput)`
  & input {
    padding: 8px 15px;
  }
`;

const InputBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledInput = styled(TextInput)`
  margin-bottom: 20px;
  & input {
    padding: 10px 20px;
  }
  & input::placeholder {
    text-decoration: underline;
  }
`;

const StyledBirthday = styled(PostKeyword)<{
  isSelected: boolean;
  isLoading: boolean;
}>`
  ${({ isSelected }) => {
    return (
      isSelected &&
      `
    & > p {color: ${colors.orange}};
    &:hover p { opacity: 1;}
  `
    );
  }}
  ${({ isLoading }) => isLoading && "cursor: wait;"}
`;

const StyledAddButton = styled(AddButton)`
  margin-top: 17px;
  flex-shrink: 0;
`;

const StyledAction = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const monthsWith31Day = [1, 3, 5, 7, 8, 10, 12];

const MonthOptions = [
  { item: "יָנוּאָר", value: 1 },
  { item: "פברואר", value: 2 },
  { item: "מרץ", value: 3 },
  { item: "אַפּרִיל", value: 4 },
  { item: "אַפּרִיל", value: 5 },
  { item: "יוני", value: 6 },
  { item: "יולי", value: 7 },
  { item: "אוגוסט", value: 8 },
  { item: "סמפמבר", value: 9 },
  { item: "אוֹקְטוֹבֶּר", value: 10 },
  { item: "נוֹבֶמבֶּר", value: 11 },
  { item: "דֵצֶמבֶּר", value: 12 },
];

const DayOptions = [
  { item: "1", value: 1 },
  { item: "2", value: 2 },
  { item: "3", value: 3 },
  { item: "4", value: 4 },
  { item: "5", value: 5 },
  { item: "6", value: 6 },
  { item: "7", value: 7 },
  { item: "8", value: 8 },
  { item: "9", value: 9 },
  { item: "10", value: 10 },
  { item: "11", value: 11 },
  { item: "12", value: 12 },
  { item: "13", value: 13 },
  { item: "14", value: 14 },
  { item: "15", value: 15 },
  { item: "16", value: 16 },
  { item: "17", value: 17 },
  { item: "18", value: 18 },
  { item: "19", value: 19 },
  { item: "20", value: 20 },
  { item: "21", value: 21 },
  { item: "22", value: 22 },
  { item: "23", value: 23 },
  { item: "24", value: 24 },
  { item: "25", value: 25 },
  { item: "26", value: 26 },
  { item: "27", value: 27 },
  { item: "28", value: 28 },
  { item: "29", value: 29 },
  { item: "30", value: 30 },
  { item: "31", value: 31 },
];

const BirthdaysEditor = React.memo(() => {
  const { t } = useTranslation();
  const { allBirthdays, isFetching, errorMessage } = useBirthdaysState();
  const {
    onGetAllBDays,
    onAddBirthday,
    onSetErrorMessage,
    onDeleteBirthday,
    onEditBirthday,
  } = useBirthdaysActions();
  const { onSetModal } = useAppActions();
  const [selectedBirthday, setSelectedBirthday] = useState<IBirthDay | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const [office, setOffice] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  // search
  const [searchBirthday, setSearchBirthday] = useState<string>("");
  const defferedSearchValue = useDeferredValue(searchBirthday);
  const searchRegex = useMemo(() => {
    return new RegExp(defferedSearchValue, "i");
  }, [defferedSearchValue]);

  const dayOptions = useMemo(() => {
    //29 days for february
    if (month === 2) return DayOptions.slice(0, 29);
    // 30 days for short months
    if (!monthsWith31Day.includes(month)) return DayOptions.slice(0, 30);
    return DayOptions;
  }, [month]);

  const searchedBirthdays = useMemo(() => {
    if (!defferedSearchValue) return allBirthdays;
    return allBirthdays.filter((bd) => searchRegex.test(bd.name));
  }, [searchRegex, defferedSearchValue, allBirthdays]);

  useEffect(() => {
    if (!dayOptions.find((op) => op.value === day)) setDay(0);
  }, [dayOptions, day]);

  useEffect(() => {
    onGetAllBDays();
  }, []);

  useEffect(() => {
    if (errorMessage) onSetErrorMessage(null);
  }, [selectedBirthday, name, office, organization, month, day]);

  useEffect(() => {
    if (selectedBirthday) {
      setName(selectedBirthday.name);
      setOffice(
        selectedBirthday.office_position ? selectedBirthday.office_position : ""
      );
      setOrganization(selectedBirthday.organization);
      setMonth(selectedBirthday.month);
      setDay(selectedBirthday.day);
    }
  }, [selectedBirthday]);

  const handleAddBirthday = (e: React.FormEvent) => {
    e.preventDefault();
    const params: IAddBirthday = {
      name,
      organization,
      month,
      day,
    };
    if (office) params.office_position = office;
    onAddBirthday(params);
  };

  const handleDeleteBirthday = (id: number) => {
    if (id === selectedBirthday?.id) setSelectedBirthday(null);
    onDeleteBirthday(id);
  };

  const handleEditBirthday = () => {
    const params: IAddBirthday = {
      name,
      organization,
      month,
      day,
    };
    if (office) params.office_position = office;
    if (selectedBirthday?.id) {
      onEditBirthday(selectedBirthday.id, params);
    }
  };

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Editor isLoading={isFetching}>
        <Content>
          <Title>{t("birthdays_title")}</Title>
          <StyledForm onSubmit={handleAddBirthday}>
            <StyledTextInput
              required={true}
              value={name}
              onChange={setName}
              placeholder={t('birthdays_name-plhr')}
              label={t('birthdays_name-label')}
            />
            <StyledTextInput
              value={office}
              onChange={setOffice}
              placeholder={t('birthdays_office-plhr')}
              label={t('birthdays_office-label')}
            />
            <StyledTextInput
              required={true}
              value={organization}
              onChange={setOrganization}
              placeholder={t('birthdays_organization-plhr')}
              label={t('birthdays_organization-label')}
            />
            <InputBox>
              <Dropdown
                label={t('birthdays_month')}
                value={month}
                onSelect={setMonth}
                options={MonthOptions}
              />
              <Dropdown
                isDisabled={!month}
                label={t('birthdays_day')}
                value={day}
                onSelect={setDay}
                options={dayOptions}
              />
              <StyledAddButton disabled={isFetching} type="submit" />
            </InputBox>
          </StyledForm>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Title>{t('birthdays_title2')}</Title>
          <StyledInput
            value={searchBirthday}
            onChange={setSearchBirthday}
            label={t('birthdays_search')}
            searchBtn={true}
          />
          <ItemsBox>
            {searchedBirthdays.map((bd) => (
              <StyledBirthday
                key={bd.id}
                isSelected={selectedBirthday?.id === bd.id}
                isLoading={isFetching}
                onClick={() => setSelectedBirthday(bd)}
                onDelete={() => handleDeleteBirthday(bd?.id)}
              >
                {bd.name}
              </StyledBirthday>
            ))}
          </ItemsBox>
        </Content>
        <ButtonBox>
          {selectedBirthday && (
            <StyledAction
              onClick={handleEditBirthday}
              color="orange"
              disabled={isFetching || !selectedBirthday}
            >
              {t("clients-editor_save")}
            </StyledAction>
          )}
          <StyledAction onClick={() => onSetModal(null)} color="blue">
            {t("keyword-editor_close")}
          </StyledAction>
        </ButtonBox>
      </Editor>
    </Modal>
  );
});

export default BirthdaysEditor;
