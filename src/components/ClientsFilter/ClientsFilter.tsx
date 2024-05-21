import React from 'react'
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import styled from "styled-components";
import { usePostsActions } from "../../store/posts/hooks";
import { postsClientsFilterSelector } from '../../store/posts/selectors';
import { Button } from "../Button";

const Filter = styled.p`
  max-width: 1400px;
  width: 100%;
  min-height: 30px;
  padding-inline-start: 30px;
  margin: 0 auto 20px;
`;

const FilterClearBtn = styled(Button)`
  display: inline-flex;
  margin-inline-start: 10px;
  cursor: pointer;
`;

const ClientsFilter = React.memo(() => {
  const { t } = useTranslation();
  const clientsFilter = useSelector(postsClientsFilterSelector)
  const { onSetClientsFilter } = usePostsActions();
  if (!clientsFilter) return <Filter></Filter>;
  return (
    <Filter>
      {t("emails_selected-filter")} {clientsFilter.client}
      <FilterClearBtn type="clear" onClick={() => onSetClientsFilter(null)}>
        {t("emails_selected-clear")}
      </FilterClearBtn>
    </Filter>
  );
});

export default ClientsFilter;
