import { dash, SignatureStart, templateBoundary } from ".";
import { IMultiPost, ISinglePost } from "../store/posts";
import { getFormatDate } from "../utilites";
import { getMondayFromWeek } from "../utilites/getMondayFromWeek";
import { TemplateType } from "./types";

//This function takes in a multipost and returns subtitle using date_added_to_db
export const composeMultiPostSubtitle = (item: IMultiPost): string => {
  const mondayDate = getFormatDate(getMondayFromWeek(item.lastUpdatedInWeeks))
  return `<p>ביום שני ה- ${mondayDate} הונחו על שולחן הכנסת הצעות החוק שלהלן:  </p><br>`;
};

const template1: TemplateType = (post): string => {
  const tempId = post.id ? post.id : dash;
  const tempTitle = post.title ? post.title : dash;
  const tempFrontLink = post.front_link ? `<a href="${post.front_link}">${post.front_link}</a>` : dash;
  const filesKeys = post.files ? Object.keys(post.files) : null;
  const tempFiles = filesKeys
    ? filesKeys.map((key: any) => {
          let list: string[] = [];
          post.files[key].forEach((item: any) =>
            list.push(`<a href=${item}>${item}</a>`)
          );
          return list.join("<br>") + "<br>";
        })
        .join("<br>")
    : dash;

  const tempInitiatorsFullNames = post.initiators
    ? post.initiators
        .map((i: any) => `${i.first_name} ${i.last_name}`)
        .join(", ")
    : dash;

  return `
  ${templateBoundary} 
  פ/${tempId} - ${tempTitle} של (${tempInitiatorsFullNames})  ${tempFrontLink} <br>
  עיקרי החוק:<br>
  ${tempFiles}<br>
  <br>
  `;
};

type OptionType = {
  item: string;
  value: keyof typeof multiTemplates;
};

export const multiTemplatesOptions: OptionType[] = [
  { item: "First", value: 1 },
];

export const multiTemplates: { [key: string]: TemplateType } = {
  1: template1,
};

//This function takes templateText and inserts into editor's content - after previous content and before signature
export const insertMultiTemplateText = (
  currentText: string,
  templateText: string
): string => {
  const row = currentText.split(SignatureStart);
  return [row[0] + templateText, row[1]].join(SignatureStart);
};
