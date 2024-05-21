import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { handle } from "../api";
import { Filters } from "../api/Filters";
import { DropdownSearch } from "../components/DropdownSearch";
import { MainButton } from "../components/MainButton";
import { TextInput } from "../components/TextInput";
import { usePostsActions } from "../store/posts/hooks";
import { useUserState } from "../store/user/hooks";

const FilterBlock = styled.div`
  max-width: 1400px;
  width: 100%;
  padding: 0 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  z-index: 2;
`;

const StyledInput = styled(TextInput)`
  width: 100%;
  & input {
    padding: 10px 20px;
  }
`;

const StyledDropdown = styled(DropdownSearch)`
  width: auto;
  flex-grow: 1;
`;

const StyledApply = styled(MainButton)`
  margin-top: 20px;
  padding: 13px 30px;
`;

const StyledClear = styled(MainButton)`
  margin-top: 20px;
  padding: 11px 30px;
  border: 0;
  box-shadow: none;
  text-decoration: underline;
`;

const emptyOption = { label: "", value: null };

const PostsFilter = React.memo(() => {
  const { t } = useTranslation();
  const { filters, token } = useUserState();
  const { onApplyFilter } = usePostsActions();
  //inputs
  const [search, setSearch] = useState<string>("");
  const [tag, setTag] = useState(emptyOption);
  const [gTag, setGtag] = useState(emptyOption);
  const [cat, setCat] = useState(emptyOption);
  //dropdown options
  const [tagOptions, setTagOptions] = useState<any[]>([]);
  const [catOptions, setCatOptions] = useState<any[]>([]);
  const [gTagOptions, setGtatOptions] = useState<any[]>([]);

  //fetch filters data
  useEffect(() => {
    if (token) {
      handle(Filters.getFilters(token)).then(([dataRes, dataErr]) => {
        if (dataRes) {
          const { tags, g_tags, cats } = dataRes;
          setTagOptions(tags.map((t: string) => ({ label: t, value: t })));
          setCatOptions(cats.map((c: string) => ({ label: c, value: c })));
          setGtatOptions(g_tags.map((c: string) => ({ label: c, value: c })));
        }
      });
    }
  }, [token]);

  //fill inputs according to current filter values
  useEffect(() => {
    setSearch(filters?.free_search ? filters.free_search : "");
    if (filters?.cat) setCat(catOptions.find((c) => c.value === filters.cat));
    if (filters?.tag) setTag(tagOptions.find((t) => t.value === filters.tag));
    if (filters?.g_tag)
      setGtag(gTagOptions.find((g) => g.value === filters.g_tag));
    //set empty options when value is null
    if (!filters?.cat) setCat(emptyOption);
    if (!filters?.tag) setTag(emptyOption);
    if (!filters?.g_tag) setGtag(emptyOption);
  }, [filters, catOptions, tagOptions, gTagOptions]);

  const handleApply = () => {
    const data = {
      free_search: search ? search : null,
      tag: tag.value,
      cat: cat.value,
      g_tag: gTag.value,
    };
    onApplyFilter(data);
  };

  const handleClear = () => {
    const data = {
      free_search: null,
      tag: null,
      cat: null,
      g_tag: null,
    };
    onApplyFilter(data);
  };

  return (
    <FilterBlock>
      <StyledInput
        searchBtn={true}
        value={search}
        onChange={setSearch}
        placeholder={t("filters-search")}
        label={t("filters-search")}
      />

      <StyledDropdown
        label={t("filters-tag")}
        onSelect={setTag}
        options={tagOptions}
        value={tag}
      />
      <StyledDropdown
        label={t("filters-cat")}
        onSelect={setCat}
        options={catOptions}
        value={cat}
      />
      <StyledDropdown
        label={t("filters-g_tag")}
        onSelect={setGtag}
        options={gTagOptions}
        value={gTag}
      />
      {(filters?.free_search ||
        filters?.tag ||
        filters?.cat ||
        filters?.g_tag) && (
        <StyledClear onClick={handleClear} color="transparent">
          {t("filters-clear")}
        </StyledClear>
      )}
      <StyledApply
        onClick={handleApply}
        color="orange"
        disabled={!search && !tag?.value && !cat?.value && !gTag?.value}
      >
        {t("filters-search")}
      </StyledApply>
    </FilterBlock>
  );
});

export default PostsFilter;
