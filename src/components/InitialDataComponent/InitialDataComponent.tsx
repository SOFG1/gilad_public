import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import { committees } from "./committees";
import { getFormatDateTime } from "../../utilites";
import { ISinglePost, PostFileType } from "../../store/posts";

const InitialData = styled.div`
  overflow-y: auto;
  margin-bottom: 10px;
`;

const PostKey = styled.p`
  font-family: Open-Sans;
  font-weight: 700;
  word-break: break-all;
  font-size: 15px;
`;

const PostValue = styled.p`
  font-family: Open-Sans;
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 15px;
  margin-bottom: 5px;
`;

const StyledFileDate = styled(PostValue)`
  margin-bottom: 0;
`

const PostLink = styled.a`
  font-family: Open-Sans;
  word-break: break-all;
  color: inherit;
`;

const FileLink = styled.a`
  display: block;
  word-break: break-all;
  margin-bottom: 15px;
`;

const PostItem = styled.div`
  margin-bottom: 18px;
`;

const PostDocLink = styled.a`
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  color: ${colors.graphite_5};
`;

const Initiators = styled.div`
  margin-bottom: 20px;
`;

const Initiator = styled.div`
  margin-bottom: 7px;
`;

const CommitteeLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: inherit;
`;


interface IProps {
  post: ISinglePost
  className?: string
}

const InitialDataComponent = React.memo(({ post, className }: IProps) => {
  const { t } = useTranslation();
  const keys = Object.keys(post);



  return (
    <InitialData className={className}>
      {post._sender === "committee_session" && committees[post.committee] && (
        <PostItem>
          <CommitteeLink
            href={`https://m.knesset.gov.il/Activity/committees/${committees[post.committee]
              }/Pages/CommitteeMaterial.aspx?ItemID=${post.id}`}
            target="_blank"
          >
            {t("emails_committee-link")}
          </CommitteeLink>
        </PostItem>
      )}



      {keys.map((key) => {
        // don't need to show this values(endpoint name, index in column...)
        if (key[0] === "_") {
          return null;
        }

        //Return only one list of files if files lists has follewed keys
        if (post[key] && key === "files" && (post.files.hasOwnProperty("פרוטוקול מליאה") || post.files.hasOwnProperty("דברי הכנסת"))) {
          let listArray: any[] = [];
          listArray.push({ type: "head", item: key });

          if (post.files.hasOwnProperty("פרוטוקול מליאה")) {
            post.files["פרוטוקול מליאה"].forEach((file: PostFileType) =>
              listArray.push({ type: "link", item: file })
            );
          }

          if (post.files.hasOwnProperty("דברי הכנסת")) {
            post.files["דברי הכנסת"].forEach((file: PostFileType) =>
              listArray.push({ type: "link", item: file })
            );
          }
          return (
            <React.Fragment key={key}>
              {listArray.length > 0 ? (
                <React.Fragment>
                  <PostKey>{t(key)}</PostKey>
                  {listArray.map((item: any, index: number) => {
                    return item.type === "head" ? (
                      <PostValue key={index}>{item.item}</PostValue>
                    ) : (
                      <React.Fragment key={index}>
                        <PostValue>{item.item.date}</PostValue>
                        <FileLink href={item.item.file} target="_blank">
                          {item.item.file}
                        </FileLink>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ) : (
                <PostValue>{t("emails_data-no-data")}</PostValue>
              )}
            </React.Fragment>
          );
        }


        if (post[key] && key === "background_materials") {
          const files = post[key]
          return <>
            <PostKey key={key}>{t(key)}</PostKey>
            {files.map((f: any, i: number) => {


              return <React.Fragment key={i}>
                <StyledFileDate>{f.date}</StyledFileDate>
                <FileLink href={f.file_link} target="_blank">
                  {f.file_title}
                </FileLink>
              </React.Fragment>

            })}

          </>
        }


        //Return cases when key is FILES
        if (post[key] && key === "files") {
          let listArray: any[] = [];
          let keys = Object.keys(post.files);
          keys.forEach((key) => {
            listArray.push({ type: "head", item: key });
            post.files[key].forEach((file: PostFileType) =>
              listArray.push({ type: "link", item: file })
            );
          });


          return (
            <React.Fragment key={key}>
              {listArray.length > 0 ? (
                <React.Fragment>
                  <PostKey>{t(key)}</PostKey>
                  {listArray.map((item: any, index: number) => {
                    return item.type === "head" ? (
                      <PostValue key={index}>{item.item}</PostValue>
                    ) : (
                      <React.Fragment key={index}>
                        <StyledFileDate>{item.item.date}</StyledFileDate>
                        <FileLink href={item.item.file} target="_blank">
                          {item.item.file}
                        </FileLink>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ) : (
                <PostValue>{t("emails_data-no-data")}</PostValue>
              )}
            </React.Fragment>
          );
        }



        //Files GOV data
        if (post[key] && key === "files_govdata") {
          const keys = Object.keys(post.files_govdata);
          const elements = keys.map((item: string, index: number) => {
            const isItemLink = /https/.test(post.files_govdata[item]);
            if (!isItemLink) {
              return (
                <React.Fragment key={index}>
                  <PostValue>{item}</PostValue>
                  <PostValue>{post.files_govdata[item]}</PostValue>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={index}>
                <PostValue>{item}</PostValue>
                <FileLink href={post.files_govdata[item]} target="_blank">
                  {post.files_govdata[item]}
                </FileLink>
              </React.Fragment>
            );
          });
          return elements.length > 0 ? (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              {elements}
            </PostItem>
          ) : (
            <PostItem>{t("emails_data-no-data")}</PostItem>
          );
        }

        // don't need to show date for sorting
        if (post[key] && key === "date_for_sorting") {
          return null;
        }

        if (post[key] && key === "front_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }


        //source_link_plenumal should be link
        if (post[key] && key === "source_link_plenumal") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        //source_link_plenum_weeklyagenda should be link
        if (post[key] && key === "source_link_plenum_weeklyagenda") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        //source_link_app_agenda should be link
        if (post[key] && key === "source_link_app_agenda") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }



        //file_link should be link
        if (post[key] && key === "file_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        //commity_link should be link
        if (post[key] && key === "commity_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        //committee_link should be link
        if (post[key] && key === "committee_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }


        //Return date_added_to_db in user time zone
        if (post[key] && key === "date_added_to_db") {
          let date: Date = new Date()
          const dateNumber = Number(post[key])
          if (isNaN(dateNumber)) { //String date
            date = new Date(post[key])
          }
          if (!isNaN(dateNumber)) { //Unix format
            date = new Date(Number(post[key] * 1000))
          }
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostValue>{getFormatDateTime(date)}</PostValue>
            </PostItem>
          );
        }


        //Return cases when key is last_updated_date
        if (post[key] && key === "last_updated_date") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostValue>{post[key]}</PostValue>
            </PostItem>
          );
        }


        // Return cases when key is source
        if (post[key] && key === "source") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is daily_agenda
        if (post[key] && key === "daily_agenda") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is root_link
        if (post[key] && key === "root_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is source_link
        if (post[key] && key === "source_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is first_link
        if (post[key] && key === "first_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is inner_link
        if (post[key] && key === "inner_link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return null when key is id(we shouldn't show id)
        if (post[key] && key === "id") {
          return null;
        }

        // Return cases when key is link
        if (post[key] && key === "link") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostLink href={post[key]} target="_blank">
                {post[key]}
              </PostLink>
            </PostItem>
          );
        }

        // Return cases when key is DOCX
        if (post[key] && key === "docx") {
          return (
            <PostItem key={key}>
              <PostDocLink href={post[key]} target="_blank">
                {key}
              </PostDocLink>
            </PostItem>
          );
        }

        // Return cases when key is PDF
        if (post[key] && key === "pdf") {
          return (
            <PostItem key={key}>
              <PostDocLink href={post[key]} target="_blank">
                {key}
              </PostDocLink>
            </PostItem>
          );
        }

        // Return cases when key is XLS
        if (post[key] && key === "xls") {
          return (
            <PostItem key={key}>
              <PostDocLink href={post[key]} target="_blank">
                {key}
              </PostDocLink>
            </PostItem>
          );
        }

        // Cases when key is cmt_session_items array
        if (post[key] && key === "cmt_session_items") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              {post[key] && (post[key] as any[]).length > 0 ? (
                (post[key] as any[]).map((item: any, index: number) => (
                  <>
                    <StyledFileDate>{item.last_updated_date}</StyledFileDate>
                    <PostValue key={index}>{item.name}</PostValue>
                  </>
                ))
              ) : (
                <>{t("emails_data-no-data")}</>
              )}
            </PostItem>
          );
        }

        // Cases when key is plenum_session_items array
        if (post[key] && key === "plenum_session_items") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              {post[key].length > 0 ? (
                post[key].map((item: any, index: number) => (
                  <PostValue key={index}>{item.name}</PostValue>
                ))
              ) : (
                <>{t("emails_data-no-data")}</>
              )}
            </PostItem>
          );
        }

        // Cases when key is initiator object
        if (post[key] && key === "initiator") {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostValue>
                {post[key].first_name} {post[key].last_name}
              </PostValue>
              <PostValue>{post[key].email}</PostValue>
            </PostItem>
          );
        }

        // Cases when key is initiators array
        if (post[key] && key === "initiators") {
          const list = post[key].map((initiator: any, index: number) => {
            return (
              <Initiator key={index}>
                <PostValue>
                  {initiator.first_name} {initiator.last_name}
                </PostValue>
                <PostValue>{initiator.email}</PostValue>
              </Initiator>
            );
          });
          return (
            <Initiators key={key}>
              <PostKey>{t(key)}</PostKey>
              {list.length > 0 ? list : <>{t("emails_data-no-data")}</>}
            </Initiators>
          );
        }

        // Return cases when value is primitive
        if (
          (post[key] && typeof post[key] === "string") ||
          typeof post[key] === "number"
        ) {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostValue dangerouslySetInnerHTML={{ __html: post[key] }}></PostValue>
            </PostItem>
          );
        }

        // Reuturn 'null' string when primitive value doesn't exist
        if (!post[key]) {
          return (
            <PostItem key={key}>
              <PostKey>{t(key)}</PostKey>
              <PostValue>{t("emails_data-no-data")}</PostValue>
            </PostItem>
          );
        }
      })}
    </InitialData>
  );
});

export default InitialDataComponent;
