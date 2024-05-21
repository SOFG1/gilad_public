import styled from "styled-components";
import { Title } from "../components/Title";
import { Dropdown, PostOption } from "../components/Dropdown";
import { colors } from "../assets/styles/colors";
import { MainButton } from "../components/MainButton";
import { useTranslation } from "react-i18next";
import { IEmail, IHistoryEmail, ISinglePost, node } from "../store/posts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IClient, useClientsState } from "../store/clients";
import { TextInput } from "../components/TextInput";
import { usePostsActions } from "../store/posts/hooks";
import { Modal } from "../components/Modal";
import { DropdownSearch } from "../components/DropdownSearch";
import { InitialDataComponent } from "../components/InitialDataComponent";
import {
  singleTemplates,
  emailTitles,
  insertSingleTemplateText,
  singleTemplatesOptions,
} from "../templates/singlePostsTemplates";
import { AddButton } from "../components/AddButton";
import { useUserState } from "../store/user/hooks";
import { useAppActions } from "../store/app/hooks";
import { FileInputFetch } from "../components/FileInputFetch";
import { OpenedPostsComponent } from "../components/OpenedPostsComponent";
import {
  EmailEditorComponent,
  EmailFonts,
} from "../components/EmailEditorComponent";
import { SuggestedClientsComponent } from "../components/SuggestedClientsComponent";
import { Posts } from "../api/Posts";
import { composeOpenedPosts } from "../utilites/composeOpenedPosts";
import { useSelector } from "react-redux";
import { postsIsFetchingSelector } from "../store/posts/selectors";
import { composeSignature, greeting } from "../templates";

const StyledModal = styled(Modal) <{ isFetching: boolean }>`
  max-width: 70vw;
  max-height: 85vh;
  display: grid;
  grid-template-columns: 1fr 2fr;
  min-height: 550px;
  ${({ isFetching }) => isFetching && "* {cursor: wait;}"}
`;

const StyledTitle = styled(Title)`
  margin-top: 10px;
  margin-bottom: 5px;
`;

const StyledLeft = styled.div`
  padding: 5px 10px;
  overflow-y: auto;
`;

const EditorBox = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div`
  padding: 0 10px;
  //Editor adds blue outline for images inside links
  a img {
    outline: 0;
  }
`;

const DropdownBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 0px 15px 7px;
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

const PostsDropdown = styled(DropdownSearch)`
  margin: 0 15px 5px;
  z-index: 6;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledInput = styled(TextInput)`
  width: calc(100% - 30px);
  margin: 0 auto 7px;
  & input {
    padding: 8px 20px;
  }
`;

const AttachmentInput = styled(FileInputFetch)`
  margin: 10px 0;
`;

type TemplatesKeyType = keyof typeof singleTemplates;

interface IProps {
  post: ISinglePost | null;
  draft: IHistoryEmail | null;
  posts: ISinglePost[];
  onClose?: () => void
}

const SinglePostEditor = React.memo(({ post, posts, draft, onClose }: IProps) => {
  const { t } = useTranslation();
  const { token } = useUserState();
  const { onSetModal } = useAppActions();
  const {
    onSendEmail,
    onSetEditor,
    onMarkAsViewed,
    onSaveDraft,
    onSetCurrentDraft,
  } = usePostsActions();
  const isFetching = useSelector(postsIsFetchingSelector);
  const { full_name, title, office_phone, mobile_phone, email, logo } =
    useUserState();
  const { clients } = useClientsState();
  // Store opened posts indices, in this modal(using dropdown)
  const [openedPosts, setOpenedPosts] = useState<ISinglePost[]>([]);
  //Templates Dropdown
  const [template, setTemplate] = useState<number>(0);
  ///////// Email content ///////////////
  const [emailTitle, setEmailTitle] = useState("");
  const [text, setText] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState<
    { name: string; id: number }[]
  >([]);
  const [clientsList, setClientsList] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [usedPosts, setUsedPosts] = useState<{ [key: string]: number[] }>({});



  //Select according template inittially
  useEffect(() => {
    selectAccordingTemplate();
  }, [post]);

  //Add the post to the used posts
  useEffect(() => {
    if (post && !usedPosts.hasOwnProperty(post._sender)) {
      setUsedPosts((prev) => ({ ...prev, [post._sender]: [post.id] }));
    }
    if (
      post &&
      usedPosts.hasOwnProperty(post._sender) &&
      !usedPosts[post._sender].includes(post.id)
    ) {
      setUsedPosts((prev) => ({
        ...prev,
        [post._sender]: [...usedPosts[post._sender], post.id],
      }));
    }
  }, [post, usedPosts]);


  //Add opened posts (used posts list) to specify in email letter
  useEffect(() => {
    if (
      post &&
      !openedPosts.some((p) => p._sender === post._sender && p.id === post.id)
    ) {
      setOpenedPosts((prev: ISinglePost[]) => [...prev, post]);
    }
  }, [post, openedPosts]);

  //Set fields according to the draft
  useEffect(() => {
    if (draft) {
      setText(draft.text);
      setEmailTitle(draft.subject);
      setAttachmentFiles(
        draft.attachments.map((a) => ({ name: a.file_name, id: a.id }))
      );
      setClientsList(
        draft.clients.map((c) => ({ label: c.name, value: c.id.toString() }))
      );
    }
    if (draft?.items) {
      const openedPosts = composeOpenedPosts(draft.items, posts);
      setOpenedPosts(openedPosts);
      setUsedPosts(draft.items);
    }
  }, [draft]);

  //Handle Add template
  const handleAddTemplate = useCallback(() => {
    const templateText = (
      singleTemplates[template as TemplatesKeyType] as Function
    )(post);
    setText((prev) => insertSingleTemplateText(prev, templateText));
  }, [post, template]);

  //Template autoselect function
  const selectAccordingTemplate = useCallback(() => {
    if (post) {
      const { tag, cat } = post;
      const template = singleTemplatesOptions.find(
        (option) => option.cat === cat && option.tag === tag
      );
      const option = template ? template.value.toString() : "0";
      setTemplate(parseInt(option, 10));
      if (!draft) {
        const templateText = singleTemplates[option](post);
        setText((prev) => insertSingleTemplateText(prev, templateText));
        setEmailTitle((prev) => prev || emailTitles[option](post));
      }
    }
  }, [post, draft]);

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
    if (draft) emailData.draft_id = draft.id;
    onSendEmail(emailData);
  }, [
    post?._sender,
    post?.id,
    emailTitle,
    text,
    clientsList,
    selectedClients,
    usedPosts,
    attachmentFiles,
  ]);

  //Handle next post
  const onNext = useCallback(() => {
    if (post) {
      const index = posts.findIndex((p) => p.id === post.id);
      if (posts[index + 1]) onSetEditor(posts[index + 1]);
      if (!posts[index + 1]) onSetModal(null);
    }
  }, [posts]);

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

  //Handle select post
  const onPostSelect = useCallback(
    (index: string) => {
      const selectedPost: ISinglePost | undefined = posts[Number(index)];
      if (selectedPost) onSetEditor(selectedPost);
    },
    [posts]
  );

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

  //Posts dropdown options
  const postsOptions = useMemo(() => {
    return posts.map((p, index: number) => ({
      value: String(index),
      label: p.title || p.name,
      tag: p.tag,
      cat: p.cat,
    }));
  }, [posts]);

  //Clients dropdown options
  const clientsOptions = useMemo(() => {
    let options = clients.map((c) => ({
      label: c.name,
      value: String(c.id),
    }));
    //Exclude suggested(checkboxes) clients from dropdown options(all clients)
    openedPosts.forEach((openedPost) => {
      if (clients?.length > 0 && openedPost.clients) {
        options = options.filter((option: any) =>
          openedPost.clients.every((client: any) => client.id != option.value)
        );
      }
    });
    return options;
  }, [clients, openedPosts]);

  //Clients checkboxes
  const suggestedClients: { id: number; name: string }[] = useMemo(() => {
    let clients: { id: number; name: string }[] = [];
    openedPosts.forEach((openedPost) => {
      if (openedPost?.clients?.length > 0) {
        openedPost.clients.forEach((client: IClient) => {
          if (clients.every((c) => c.id !== client.id))
            clients.push({ id: client.id, name: client.name });
        });
      }
    });
    return clients;
  }, [openedPosts]);

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

  //select template
  useEffect(() => {
    if (!draft && text === "") {
      setText(`${greeting} ${signature}`);
      selectAccordingTemplate();
    }
  }, [signature, draft, text]);

  const handleClose = useCallback(() => {
    if(onClose) onClose()
    onSetEditor(null);
    onSetCurrentDraft(null);
    attachmentFiles.forEach((file) => Posts.deleteAttachment(file.id, token));
  }, [attachmentFiles, onClose]);

  const postsDropdownValue = useMemo(() => {
    return post ? postsOptions[posts.indexOf(post)] : {};
  }, [postsOptions, post]);


  useEffect(() => {
    if (post) {
      onMarkAsViewed(post._sender, post.id)
    }
  }, [post])

  return (
    <StyledModal onClose={handleClose} isFetching={isFetching}>
      <StyledLeft>
        <StyledTitle>{t("emails_data-from-db")}</StyledTitle>
        {post && <InitialDataComponent post={post} />}
        {openedPosts.length > 1 && (
          <OpenedPostsComponent
            openedPosts={openedPosts}
            usedPosts={usedPosts}
            onUsedPostSelect={onUsedPostSelect}
          />
        )}
      </StyledLeft>
      <EditorBox>
        <StyledTitle>{t("emails_edit-title")}</StyledTitle>
        <PostsDropdown
          onSelect={(p) => onPostSelect(p.value)}
          value={postsDropdownValue}
          options={postsOptions}
          label={t("emails_posts")}
          components={{ Option: PostOption }}
        />
        <DropdownBox>
          <Dropdown
            placeholder=""
            onSelect={(e) => setTemplate(e)}
            value={template}
            options={singleTemplatesOptions}
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
            suggestedClients={suggestedClients}
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
            {post && (
              <MainButton onClick={onNext} color="blue">
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

export default SinglePostEditor;
