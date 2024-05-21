import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../assets/styles/colors";
import { AddButton } from "../components/AddButton";
import { ButtonBox } from "../components/ButtonBox";
import { Checkbox } from "../components/Checkbox";
import { DropdownSearch } from "../components/DropdownSearch";
import { ItemsBox } from "../components/ItemsBox";
import { MainButton } from "../components/MainButton";
import FileInput from "../components/FileInput/FileInput";
import { Modal } from "../components/Modal";
import { PostKeyword } from "../components/PostKeyword";
import { TextInput } from "../components/TextInput";
import { Title } from "../components/Title";
import { useAppActions } from "../store/app/hooks";
import { useClientsState } from "../store/clients";
import { useUserState } from "../store/user/hooks";
import {
  IEditUser,
  IUser,
  useUsersActions,
  useUsersState,
} from "../store/users";

const Editor = styled.div<{ isLoading: boolean }>`
  ${({ isLoading }) => isLoading && "& * {cursor: wait !important;"}
`;

const Content = styled.div`
  padding: 40px 30px 30px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 10px;
`;

const UserForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
`;

const StyledKeyword = styled(PostKeyword)<{
  isSelected: boolean;
  isLoading: boolean;
}>`
  ${({ isSelected }) => {
    return (
      isSelected &&
      `
    & p {color: ${colors.orange}};
    &:hover p { opacity: 1;}
  `
    );
  }}
  ${({ isLoading }) => isLoading && "cursor: wait;"}
`;

const StyledClear = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
  margin-inline-start: auto;
  align-self: flex-end;
  margin-inline-end: 15px;
`;

const StyledAction = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const StyledInput = styled(TextInput)`
  width: 48.5%;
  & input {
    padding: 8px 15px;
  }
`;

const StyledFileInput = styled(FileInput)`
  grid-column: span 2;
`;

const StyledDropdownSearch = styled(DropdownSearch)`
  width: 48.5%;
`;

const StyledCheckbox = styled.label`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.p`
  font-family: "Gilroy-R", sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: ${colors.graphite_6};
`;

const StyledAddBtn = styled(AddButton)`
  margin-inline-start: auto;
  margin-inline-end: 15px;
`;

const StyledSearch = styled(TextInput)`
  width: 100%;
  margin-bottom: 20px;
  & input {
    padding: 8px 15px;
  }
`;

const AddUser = React.memo(() => {
  const { t } = useTranslation();
  const { onSetModal } = useAppActions();
  const { users, isFetching, selectedUserId } = useUsersState();
  const { clients } = useClientsState();
  const { onAddUser, onDeleteUser, onSelectUser, onEditUser } =
    useUsersActions();

  //UserData
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [fullNameEn, setFullNameEn] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [mobPhone, setMobPhone] = useState<string>("");
  const [officePhone, setOfficePhone] = useState<string>("");
  const [clientEditor, setClientEditor] = useState<boolean>(false);
  const [keywordEditor, setKeywordEditor] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [staff, setStaff] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>();
  // /UserData
  const [search, setSearch] = useState<string>("");
  const defferedSearch = useDeferredValue(search);

  //Delete user
  const handleDelete = (id: number) => {
    if (!isFetching) onDeleteUser(id);
  };

  //Edit user
  const handleEdit = () => {
    let data: IEditUser = {
      login,
      email,
      is_staff: staff,
      is_active: active,
      is_client_editor: clientEditor,
      is_keyword_editor: keywordEditor,
    };
    if (password) data.password = password;
    if (fullName) data.full_name = fullName;
    if (fullNameEn) data.full_name_en = fullNameEn;
    if (mobPhone) data.mobile_phone = mobPhone;
    if (officePhone) data.office_phone = officePhone;
    if (title) data.title = title;
    if (
      typeof imageInputRef.current?.files?.length === "number" &&
      imageInputRef.current?.files?.length > 0
    ) {
      data.logo = imageInputRef.current?.files[0];
    }
    onEditUser(data);
  };

  //Add user
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data: any = {
      login,
      password,
      email,
      is_staff: staff,
      is_active: active,
      is_client_editor: clientEditor,
      is_keyword_editor: keywordEditor,
    };
    if (fullName) data.full_name = fullName;
    if (fullNameEn) data.full_name_en = fullNameEn;
    if (mobPhone) data.mobile_phone = mobPhone;
    if (officePhone) data.office_phone = officePhone;
    if (title) data.title = title;
    //Custom signature image uplaoding
    // if (
    //   typeof imageInputRef.current?.files?.length === "number" &&
    //   imageInputRef.current?.files?.length > 0
    // ) {
    //   data.logo = imageInputRef.current?.files[0];
    // }
    onAddUser(data);
  };

  //Clear inputs
  const handleClear = () => {
    onSelectUser(null);
    setLogin("");
    setPassword("");
    setEmail("");
    setActive(true);
    setStaff(false);
    setClientEditor(false);
    setKeywordEditor(false);
    setFullName("");
    setFullNameEn("");
    setTitle("");
    setMobPhone("");
    setOfficePhone("");
  };

  //Cleanup after close
  useEffect(() => {
    return () => onSelectUser(null);
  }, []);

  //Fill inputs after user selected
  useEffect(() => {
    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (selectedUser) {
      setLogin(selectedUser.login);
      setEmail(selectedUser.email);
      setClientEditor(selectedUser.is_client_editor);
      setActive(selectedUser.is_active);
      setStaff(selectedUser.is_staff);
      setKeywordEditor(selectedUser.is_keyword_editor);
      if (selectedUser.full_name) setFullName(selectedUser.full_name);
      if (selectedUser.full_name_en) setFullNameEn(selectedUser.full_name_en);
      if (selectedUser.mobile_phone) setMobPhone(selectedUser.mobile_phone);
      if (selectedUser.office_phone) setOfficePhone(selectedUser.office_phone);
      if (selectedUser.title) setTitle(selectedUser.title);
    }
  }, [selectedUserId, users]);

  //Searched users
  const usersFiltered = useMemo(() => {
    const regex = new RegExp(defferedSearch, "i");
    return defferedSearch ? users.filter((u) => regex.test(u.login)) : users;
  }, [defferedSearch, users]);

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Editor isLoading={false}>
        <Content>
          <StyledTitle>{t("add-user_title1")}</StyledTitle>
          <UserForm onSubmit={(e) => handleSubmit(e)}>
            <StyledInput
              value={login}
              onChange={setLogin}
              label={t("add-user_login")}
            />
            <StyledInput
              value={password}
              onChange={setPassword}
              label={t("add-user_password")}
            />
            <StyledInput
              value={email}
              onChange={setEmail}
              label={t("add-user_email")}
            />
            <StyledInput
              value={fullName}
              onChange={setFullName}
              label={t("add-user_full-name")}
            />
            <StyledInput
              value={fullNameEn}
              onChange={setFullNameEn}
              label={t("add-user_full-name_en")}
            />
            <StyledInput
              value={title}
              onChange={setTitle}
              label={t("add-user_title")}
            />
            <StyledInput
              value={mobPhone}
              onChange={setMobPhone}
              label={t("add-user_mob-phone")}
            />
            <StyledInput
              value={officePhone}
              onChange={setOfficePhone}
              label={t("add-user_office-phone")}
            />
            <StyledClear onClick={handleClear} color="blue" type="reset">
              {t("add-user_clear")}
            </StyledClear>
            <StyledAddBtn disabled={isFetching} />
            <StyledFileInput
              ref={imageInputRef}
              accept="image/png, image/jpeg"
              text={t("add-user_signature")}
            />
          </UserForm>
          <div>
            <StyledCheckbox>
              <Checkbox
                checked={active}
                setIsCheckedCreate={(val) => setActive(val)}
              />
              <CheckboxLabel>{t("add-user_active")}</CheckboxLabel>
            </StyledCheckbox>
            <StyledCheckbox>
              <Checkbox
                checked={staff}
                setIsCheckedCreate={(val) => setStaff(val)}
              />
              <CheckboxLabel>{t("add-user_staff")}</CheckboxLabel>
            </StyledCheckbox>
            <StyledCheckbox>
              <Checkbox
                checked={clientEditor}
                setIsCheckedCreate={(val) => setClientEditor(val)}
              />
              <CheckboxLabel>{t("add-user_client-editor")}</CheckboxLabel>
            </StyledCheckbox>
            <StyledCheckbox>
              <Checkbox
                checked={keywordEditor}
                setIsCheckedCreate={(val) => setKeywordEditor(val)}
              />
              <CheckboxLabel>{t("add-user_keyword-editor")}</CheckboxLabel>
            </StyledCheckbox>
          </div>
          <StyledTitle>{t("add-user_title2")}</StyledTitle>
          <StyledSearch
            value={search}
            onChange={setSearch}
            label={t("add-user_search")}
            searchBtn={true}
          />
          <ItemsBox>
            {usersFiltered.map((u: IUser) => (
              <StyledKeyword
              confirmDelMessage={t('add-user_del-warning')}
                isSelected={selectedUserId === u.id}
                onDelete={() => handleDelete(u.id)}
                isLoading={isFetching}
                onClick={() => onSelectUser(u.id)}
                key={u.id}
              >
                {u.login}
              </StyledKeyword>
            ))}
          </ItemsBox>
        </Content>
        <ButtonBox>
          <StyledAction onClick={() => onSetModal(null)} color="blue">
            {t("add-user_close")}
          </StyledAction>
          <StyledAction
            onClick={handleEdit}
            color="orange"
            disabled={isFetching || selectedUserId === null}
          >
            {t("add-user_save")}
          </StyledAction>
        </ButtonBox>
      </Editor>
    </Modal>
  );
});

export default AddUser;
