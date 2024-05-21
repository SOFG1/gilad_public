import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Posts } from "../api/Posts";
import { AddButton } from "../components/AddButton";
import { Dropdown, PostOption } from "../components/Dropdown";
import { DropdownSearch } from "../components/DropdownSearch";
import {
  EmailEditorComponent,
  EmailFonts,
} from "../components/EmailEditorComponent";
import { InitialDataComponent } from "../components/InitialDataComponent";
import { Modal } from "../components/Modal";
import { OpenedPostsComponent } from "../components/OpenedPostsComponent";
import { TextInput } from "../components/TextInput";
import { Title } from "../components/Title";
import { useAppActions } from "../store/app/hooks";
import { IEmail, IMultiPost, ISinglePost, node } from "../store/posts";
import { usePostsActions } from "../store/posts/hooks";
import { postsIsFetchingSelector } from "../store/posts/selectors";
import { useUserState } from "../store/user/hooks";
import {
  composeMultiPostSubtitle,
  insertMultiTemplateText,
  multiTemplates,
  multiTemplatesOptions,
} from "../templates/multiPostsTemplates";
import { FileInputFetch } from "../components/FileInputFetch";
import { colors } from "../assets/styles/colors";
import { SuggestedClientsComponent } from "../components/SuggestedClientsComponent";
import { useClientsState } from "../store/clients";
import { MainButton } from "../components/MainButton";
import { composeUsedPosts } from "../utilites/composeUsedPosts";
import { composeSignature, greeting } from "../templates";

const StyledModal = styled(Modal)<{ isFetching: boolean }>`
  max-width: 70vw;
  max-height: 85vh;
  display: grid;
  grid-template-columns: 1fr 2fr;
  min-height: 550px;
  ${({ isFetching }) => isFetching && "* {cursor: wait;}"}
`;

const StyledLeft = styled.div`
  padding: 5px 10px;
`;

const EditorBox = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled(Title)`
  margin-top: 10px;
  margin-bottom: 5px;
`;

const PostsDropdown = styled(DropdownSearch)`
  margin: 0 15px 5px;
  z-index: 6;
`;

const DropdownBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 0px 15px 7px;
`;

const StyledInput = styled(TextInput)`
  width: calc(100% - 30px);
  margin: 0 auto 7px;
  & input {
    padding: 8px 20px;
  }
`;

const EditorContainer = styled.div`
  padding: 0 10px;
  //Editor adds blue outline for images inside links
  a img {
    outline: 0;
  }
`;

const AttachmentInput = styled(FileInputFetch)`
  margin: 10px 0;
`;

const Selector = styled.div`
  padding: 7px 20px;
  background: #ffffff;
  box-shadow: 0px -3px 7px rgba(0, 0, 0, 0.25);
  border-radius: 0 0 15px 15px;
  margin-top: auto;
`;

const SelectorTitle = styled.h3`
  text-align: center;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: ${colors.graphite_6};
`;

const ClientDropdown = styled(DropdownSearch)`
  margin-bottom: 10px;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

//This function takes in a list of posts and returns an option composed from first post
const composePostOption = (posts: ISinglePost[]) => {
  const firstPost = posts[0];
  return {
    label: firstPost.title || firstPost.name,
    value: "0",
    tag: firstPost.tag,
    cat: firstPost.cat,
  };
};

interface IProps {
  item: IMultiPost;
}

const MultiPostEditor = React.memo(({ item }: IProps) => {
  const { t } = useTranslation();
  const { token } = useUserState();
  const isFetching = useSelector(postsIsFetchingSelector);
  const { full_name, title, office_phone, mobile_phone, email, logo } =
    useUserState();
  const { clients } = useClientsState();
  const { onSetCurrentDraft, onSetEditor, onSendEmail, onSaveDraft } =
    usePostsActions();
  const { onSetModal } = useAppActions();
  /////// States /////////////////////
  const [selectedPostOption, setSelectedPostOption] = useState(
    composePostOption(item.posts)
  );
  const [template, setTemplate] = useState<number>(0);
  //////// Email content states //////////////
  const [emailTitle, setEmailTitle] = useState("");
  const [text, setText] = useState<string>("");
  const [attachmentFiles, setAttachmentFiles] = useState<
    { name: string; id: number }[]
  >([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [clientsList, setClientsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [usedPosts, setUsedPosts] = useState<{ [key: string]: number[] }>({});

  /////////////////
  const selectedPost: ISinglePost | undefined = useMemo(() => {
    const index = Number(selectedPostOption.value);
    return item.posts[index];
  }, [item.posts, selectedPostOption]);

  const postsOptions = useMemo(() => {
    return item.posts.map((p: ISinglePost, index: number) => ({
      label: p.title || p.name,
      value: String(index),
      tag: p.tag,
      cat: p.cat,
    }));
  }, []);

  //Clients dropdown options
  const clientsOptions = useMemo(() => {
    let options = clients.map((c) => ({
      label: c.name,
      value: String(c.id),
    }));
    //Exclude suggested(checkboxes) clients from dropdown options(all clients)
    if (clients?.length > 0 && item.clients) {
      options = options.filter((option: any) =>
        item.clients.every((client: any) => client.id != option.value)
      );
    }
    return options;
  }, [clients, item.clients]);

  const nextPostOption = useMemo(() => {
    // selectedPostOption.value equals to it's index in postsOptions array
    return postsOptions[Number(selectedPostOption.value) + 1];
  }, [selectedPostOption, postsOptions]);

  //Letter signature
  const signature: string = useMemo(() => {
    return composeSignature({
      full_name,
      title,
      office_phone,
      mobile_phone,
      email,
      logo,
    });
  }, [full_name, title, office_phone, mobile_phone, email, logo]);
  
  const handleClose = useCallback(() => {
    onSetModal(null);
    onSetEditor(null);
    onSetCurrentDraft(null);
    attachmentFiles.forEach((file) => Posts.deleteAttachment(file.id, token));
  }, [attachmentFiles]);

  //Handle select used posts
  const onUsedPostSelect = useCallback(
    (node: node, id: number) => {
      if (usedPosts.hasOwnProperty(node) && usedPosts[node].includes(id)) {
        setUsedPosts((prev) => ({
          ...prev,
          [node]: prev[node].filter((i) => i !== id),
        }));
      }
      if (usedPosts.hasOwnProperty(node) && !usedPosts[node].includes(id)) {
        setUsedPosts((prev) => ({ ...prev, [node]: [...prev[node], id] }));
      }
      if (!usedPosts.hasOwnProperty(node)) {
        setUsedPosts((prev) => ({ ...prev, [node]: [id] }));
      }
    },
    [usedPosts]
  );

  //Handle send email (btn click)
  const handleSendEmail = useCallback(() => {
    const emailData: IEmail = {
      subject: emailTitle,
      //Convert to RTL in email box
      html: `${EmailFonts} <div style="direction: rtl;" dir="RTL">${text}</div>`,
      recipients_ids: [
        ...clientsList.map((c) => parseInt(c.value)),
        ...selectedClients,
      ],
      items: usedPosts as {
        [key in  node]: number[];
      },
      attachments: attachmentFiles.map((f) => f.id),
    };
    onSendEmail(emailData);
  }, [
    emailTitle,
    text,
    clientsList,
    selectedClients,
    usedPosts,
    attachmentFiles,
  ]);

  //Handle save to drafts
  const handleSaveDraft = useCallback(() => {
    const data: any = {
      subject: emailTitle,
      html: text,
      recipients_ids: [
        ...selectedClients,
        ...clientsList.map((c) => parseInt(c.value)),
      ],
      items: usedPosts,
      attachments: attachmentFiles.map((f) => f.id),
    };
    onSaveDraft(data);
  }, [
    emailTitle,
    text,
    selectedClients,
    clientsList,
    usedPosts,
    attachmentFiles,
  ]);

  const handleNext = useCallback(() => {
    if (nextPostOption) setSelectedPostOption(nextPostOption);
  }, [nextPostOption]);

    //Handle Add template
    const handleAddTemplate = useCallback(() => {
      console.log(template);
      console.log(selectedPost);
      const templateText = multiTemplates[template](selectedPost)
      setText((prev) => insertMultiTemplateText(prev, templateText))
    }, [template, selectedPost]);


  //Initially set used posts to all posts in the item
  useEffect(() => {
    const usedPosts = composeUsedPosts(item.posts);
    setUsedPosts(usedPosts);
  }, [item.posts]);

  //Inititally set email title according this item
  useEffect(() => {
    setEmailTitle(item.title);
  }, [item]);
  

  console.log(item);
  
  //Inititally add template according this item
  useEffect(() => {
    const subtitle = composeMultiPostSubtitle(item)
    let text = `${greeting} ${subtitle} ${signature}`
    item.posts.forEach(post => {
      text = insertMultiTemplateText(text, multiTemplates[1](post))
    })
    setText(text)
  }, [item, signature, greeting]);

  return (
    <StyledModal onClose={handleClose} isFetching={isFetching}>
      <StyledLeft>
        <StyledTitle>{t("emails_data-from-db")}</StyledTitle>
        {selectedPost && <InitialDataComponent post={selectedPost} />}
        <OpenedPostsComponent
          openedPosts={item.posts}
          usedPosts={usedPosts}
          onUsedPostSelect={onUsedPostSelect}
        />
      </StyledLeft>
      <EditorBox>
        <StyledTitle>{t("emails_edit-title")}</StyledTitle>
        <PostsDropdown
          onSelect={setSelectedPostOption}
          value={selectedPostOption}
          options={postsOptions}
          label={t("emails_posts")}
          components={{ Option: PostOption }}
        />
        <DropdownBox>
          <Dropdown
            placeholder=""
            onSelect={(e) => setTemplate(e)}
            value={template}
            options={multiTemplatesOptions}
            label={t("emails_content-formats")}
          />
          <AddButton onClick={handleAddTemplate} disabled={!template} />
        </DropdownBox>
        <StyledInput
          value={emailTitle}
          onChange={setEmailTitle}
          placeholder={t("emails_email-subject")}
          label={t("emails_email-subject")}
        />
        <EditorContainer>
          <EmailEditorComponent content={text} onChange={setText} />
        </EditorContainer>
        <AttachmentInput
          filesList={attachmentFiles}
          onChange={setAttachmentFiles}
        />
        <Selector>
          <SelectorTitle>{t("emails_select-clients")}</SelectorTitle>
          <SuggestedClientsComponent
            suggestedClients={item.clients}
            selectedClients={selectedClients}
            onChange={setSelectedClients}
          />
          <ClientDropdown
            isMulti={true}
            onSelect={setClientsList}
            value={clientsList}
            options={clientsOptions}
            label={t("emails_clients-label")}
            isReversed={true}
          />
          <BtnBox>
            {nextPostOption && (
              <MainButton onClick={handleNext} color="blue">
                {t("emails_edit-next")}
              </MainButton>
            )}
            <MainButton
              onClick={handleSendEmail}
              color="orange"
              disabled={isFetching}
            >
              {t("emails_edit-send")}
            </MainButton>
            <MainButton
              onClick={handleSaveDraft}
              color="blue"
              disabled={isFetching}
            >
              {t("emails_edit-save_draft")}
            </MainButton>
          </BtnBox>
        </Selector>
      </EditorBox>
    </StyledModal>
  );
});

export default MultiPostEditor;
