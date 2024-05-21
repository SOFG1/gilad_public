import { ISinglePost, PostFileType } from "../store/posts";
import { TemplateType } from "./types";
import { b64_image } from "./signImageB64";
import { convertStringToDate, getDaysCount } from "../utilites";
import { dash, SignatureStart, templateBoundary } from ".";

// Templates are functions that takes post and returns text with inserted data from the post
// Tamplates:
const template0: TemplateType = (post: ISinglePost) => "";

const template1: TemplateType = (post: ISinglePost) => {
  const tempStartDate = post.start_date ? post.start_date : dash;
  const tempComittee = post.committee
    ? post.committee
    : dash;
  const tempLocation = post.location ? post.location : dash;
  const tempSessionItems = Array.isArray(post.cmt_session_items)
    ? `<strong>${post.cmt_session_items.map((i) => i.name).join(", ")}</strong>`
    : dash;
  //files
  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          return list.join("<br>") + "<br>";
        })
        .join("<br>")
    : dash;
  //result
  return `
  ${templateBoundary}
  ביום ${tempStartDate} יתקיים דיון ${tempComittee} בנושא:  ${tempSessionItems} <br>
  הדיון יתקיים ב  ${post.location ? tempLocation : tempComittee} <br>
  להלן${tempFiles}
  <br>`;
};

const template3: TemplateType = (post: ISinglePost) => {
  const tempDateTime = post.datetime_knesset ? post.datetime_knesset : dash;
  const tempArticle = post.article_by_line ? post.article_by_line : dash;
  const tempPageContent = post.pulished_page_content
    ? post.pulished_page_content
    : dash;
  const tempLink = post.link ? `<a href="${post.link}">${post.link}</a>` : dash;
  return `
  ${templateBoundary}
  להלן הודעה לעיתונות מדיון שהתקיים ב – (${tempDateTime}) ב ${tempArticle}<br>
  <br>
  ${tempPageContent}<br>
  לינק לידיעה: ${tempLink}
  <br>`;
};

const template4: TemplateType = (post: ISinglePost) => {
  const tempStartDate = post.start_date ? post.start_date : dash;
  const tempItems = post.cmt_session_items
    ? post.cmt_session_items.map((item: any) => item.name).join(", ")
    : dash;
  const tempComittee = post.committee
    ? `<strong>${post.committee}</strong>`
    : dash;
  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;

  const tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          if (key === "פרוטוקול ועדה") return list.join("<br>") + "<br>";
          return undefined;
        })
        .join("<br>")
    : dash;
  return `
  ${templateBoundary}
  מצ"ב פרוטוקול דיון שהתקיים ב – (${tempStartDate}) בוועדת ${tempComittee}  בנושאים: <br>
  ${tempItems} <br>
  קובץ: ${tempFiles}
  <br>`;
};

const template6: TemplateType = (post: ISinglePost) => {
  console.log(post, "?")
  const tempUpdatedDate = post.last_updated_date
    ? post.last_updated_date.slice(0, 8)
    : dash;
  const tempTitle = post.title ? post.title : null;
  const tempInitiators = post.initiators
    ? post.initiators
        .map((i: any) => `${i.first_name} ${i.last_name}`)
        .join(", ")
    : dash;
  const tempSummaryLaw =
    post.summary_law && typeof post.summary_law === "string"
      ? post.summary_law
      : dash;
  const tempStatus = post.status ? post.status : dash;

  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          return list.join("<br>") + "<br>";
        })
        .join("<br>")
    : dash;

  return `
  ${templateBoundary}
  היום, ${tempUpdatedDate}  הצעות החוק ${tempStatus}: <br>
  פ/${post.bill_number || ""} – ${tempTitle} של ח"כ ${tempInitiators} <br>
  תקציר הצעת החוק: ${tempSummaryLaw} <br>
  שם הח"כ המציע : ${tempInitiators} <br>
  קובץ מלא של הצעת החוק: <br>
  ${tempFiles}
  <br>`;
};

const template8: TemplateType = (post: ISinglePost) => {
  const tempSubmitDate = post.submit_date ? post.submit_date : dash;
  const tempSubcategory = post.subcategory ? post.subcategory : dash;
  const tempGovMinistry = post.gov_ministry ? post.gov_ministry : dash;
  const tempTitle = post.title ? post.title : dash;
  const tempFirstName = post.initiator?.first_name
    ? post.initiator?.first_name
    : dash;
  const tempLastName = post.initiator?.last_name
    ? post.initiator?.last_name
    : dash;
  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          return list.join("<br>") + "<br>";
        })
        .join("<br>")
    : dash;

  const showFooter =
    post.subcategory === "שאילתה רגילה" && post._sender === "query";
  const tempFooter = showFooter
    ? "תשובה לשאילתא צפויה להנתן בעוד כ-21 יום"
    : "";
  return `
  ${templateBoundary}
  ב${tempSubmitDate} תעלה במליאת הכנסת שאילתה ${tempSubcategory} לשר ה ${tempGovMinistry} בנושא ${tempTitle} של חה"כ ${tempFirstName} ${tempLastName}. <br>
  תוכן שאילתא: <br>
  ${tempFiles}  
  <br>
  ${tempFooter}<br>
  `;
};

const template9: TemplateType = (post: ISinglePost) => {
  const tempTitle = post.title ? post.title : dash;
  const tempFirstName = post.initiator?.first_name
    ? post.initiator.first_name
    : dash;
  const tempLastName = post.initiator?.last_name
    ? post.initiator.last_name
    : dash;
  const tempSubCategory = post.subcategory ? post.subcategory : dash;
  const tempStatus = post.status ? post.status : dash;
  return `
  ${templateBoundary}
  ביום _______ ה – (תאריך) תעלה במליאת הכנסת הצעה לסדר היום בנושא ${tempTitle} של חה"כ ${tempFirstName} ${tempLastName}. <br>
  הצעה ${tempSubCategory},   ${tempStatus}
  <br> `;
};

//This template contains 2 different templates depending on post's start_date
//If post.start_date is past use the second template
const template10: TemplateType = (post: ISinglePost) => {
  const nowInMS = new Date().getTime();
  const startDateInMS = post.start_date
    ? convertStringToDate(post.start_date).getTime()
    : null; //start_date in MS
  const tempId = post.id ? post.id : dash;
  const tempKnessetNum = post.knesset_num ? post.knesset_num : dash;
  const tempStartDate = post.start_date ? post.start_date : dash;
  const tempPlenumItems = Array.isArray(post.plenum_session_items)
    ? post.plenum_session_items.map((item) => item.name).join("<br>")
    : dash;
  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;
  let tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          if (key === "פרוטוקול מליאה" || key === "דברי הכנסת")
            return list.join("<br>") + "<br>";
          return undefined;
        })
        .join("<br>")
    : dash;
  //First template
  if (startDateInMS && startDateInMS > nowInMS) {
    return `
    ${templateBoundary}
    ישיבת מליאת הכנסת עתידה להפתח ישיבה מס${tempId} של הכנסת ה${tempKnessetNum}  ב${tempStartDate}  
    <br>
`;
  }
  //Second template
  // if (
  //   post.files?.hasOwnProperty("פרוטוקול מליאה") ||
  //   post.files?.hasOwnProperty("דברי הכנסת")
  // ) {
  //Change file list for this template
  tempFiles = "";
  post.files["פרוטוקול מליאה"]?.forEach(
    (file: PostFileType) => (tempFiles += `<a href=${file.file}>${file.file}</a><br>`)
  );
  post.files["דברי הכנסת"]?.forEach(
    (file: PostFileType) => (tempFiles += `<a href=${file.file}>${file.file}</a><br>`)
  );
  return `
  ${templateBoundary}
  מצ"ב מפרוטוקול הדיון המלא שהתקיים ב ${tempStartDate} במליאת הכנסת בנושאים ${tempPlenumItems}. <br>
  ${tempFiles}
  <br>`;
  //}

  // //Third template, also shows not all files in the post
  // tempFiles = post.files["תור מליאה"]
  //   .map((file: PostFileType) => (tempFiles += `<a href=${file.file}>${file.file}</a><br>`))
  //   .join("");
  // return `
  //   ${templateBoundary}
  //   מצ"ב קטע מפרוטוקול הדיון שהתקיים ב ${tempStartDate} במליאת הכנסת בנושאים ${tempPlenumItems}. <br>
  //   ${tempFiles}
  //   <br>`;
};

const template11: TemplateType = (post: ISinglePost) => {
  const tempCat = post.cat ? post.cat : dash;
  const tempSubCategory = post.subcategory ? post.subcategory : dash;
  const tempTitle = post.title ? post.title : dash;
  const tempFirstName = post.initiator ? post.initiator.first_name : dash;
  const tempLastName = post.initiator ? post.initiator.last_name : dash;
  const tempStatus = post.status ? post.status : dash;
  const tempCommittee = post.committee
    ? `<strong>${post.committee}</strong>`
    : dash;
  const filesKeys =
    typeof post.files == "object" ? Object.keys(post.files) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: any) => {
          let list = [key];
          post.files[key].forEach((item: PostFileType) =>
            list.push(`<a href=${item.file}>${item.file}</a>`)
          );
          return list.join("<br>") + "<br>";
        })
        .join("<br>")
    : dash;
  //result
  return `
  ${templateBoundary}
  ${tempCat} מסוג ${tempSubCategory} בנושא ${tempTitle} של חה"כ  ${tempFirstName} ${tempLastName} ${tempStatus}.<br>
  הדיון ישובץ במהלך השבועיים הקרובים ב ${tempCommittee}.<br>
  ${tempFiles}
  <br>`;
};

const template12: TemplateType = (post: ISinglePost) => {
  const tempMeetingDate = post.meeting_date ? post.meeting_date : dash;
  const tempDescription = post.description ? post.description : dash;

  const filesKeys = post.files_govdata ? Object.keys(post.files_govdata) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: string, index: number) => {
          return `${index + 1}. ${key}<br>
      דברי הסבר: ${tempDescription}<br>
      קובץ עם פירוט מלא: <a href= ${post.files_govdata[key]}>${
            post.files_govdata[key]
          }</a>`;
        })
        .join("<br>")
    : dash;

  return `
  ${templateBoundary}
  ביום ${tempMeetingDate} תתכנס הממשלה לישיבתה השבועית. <br>
  על סדר היום: <br>
  ${tempFiles}
  <br>`;
};

const template13: TemplateType = (post: ISinglePost) => {
  const tempMeetingDate = post.meeting_date ? post.meeting_date : dash;
  const filesKeys = post.files_govdata ? Object.keys(post.files_govdata) : null;
  const tempFiles = filesKeys
    ? filesKeys
        .map((key: string, index: number) => {
          return `${index + 1}. ${key}<br>
      קובץ עם פירוט מלא: <a href= ${post.files_govdata[key]}>${
            post.files_govdata[key]
          }</a>`;
        })
        .join("<br>")
    : dash;
  return `
  ${templateBoundary}
  ב${tempMeetingDate} התכנסה הממשלה לישיבתה השבועית.<br>
  להלן החלטותיה: <br>
  ${tempFiles}
  <br>`;
};

const template14: TemplateType = (post: ISinglePost) => {
  const tempMeetingDate = post.meeting_date ? post.meeting_date : dash;
  const tempLink = post.link ? `<a href="${post.link}">${post.link}</a>` : dash;
  return `
  ${templateBoundary}
  ביום ראשון ה- ${tempMeetingDate} תתכנס ועדת שרים לענייני חקיקה.<br>
  על סדר היום:<br>
  <br>
  <ul>
    <li>פ/_____ (שם הצעת החוק) של חה"כ ________.</li>
    <li>פ/_____ (שם הצעת החוק) של חה"כ ________.</li>
    <li>פ/_____ (שם הצעת החוק) של חה"כ ________.</li>
    <li>טיוטת חוק שהוכנה ע"י משרד _______ לבצע התאמה של המשרד הרלוונטי למשל: משרד הבריאות/ האנרגיה/ ביטחון פנים</li>
  </ul>
  מצ"ב נוסח הצעות החוק.<br>
  ${tempLink}
  <br>`;
};

const template15: TemplateType = (post: ISinglePost) => {
  const tempMeetingDate = post.meeting_date ? post.meeting_date : dash;
  return `
  ${templateBoundary}
  ביום ראשון ה- ${tempMeetingDate} ועדת שרים לענייני חקיקה. <br>
  להלן  החלטותיה: <br>
  פ/_____ (שם הצעת החוק) של חה"כ ________ - הממשלה תמכה בהצעת החוק (במקרה של תמיכה).<br>
  פ/_____ (שם הצעת החוק) של חה"כ ________ - הממשלה התנגדה להצעת החוק (במקרה של התנגדות)
  <br>`;
};

const template16: TemplateType = (post: ISinglePost) => {
  const tempName = post.name ? post.name : dash;
  const tempMinistry = post.ministry ? post.ministry : dash;
  const tempDescription = post.description ? post.description : dash;
  const tempExpirationDate = post.exp_date ? post.exp_date : dash;
  const tempLink = post.link ? `<a href="${post.link}">${post.link}</a>` : dash;

  return `
  ${templateBoundary}
  מצ"ב תזכיר חוק ${tempName} שהוכן ע"י ${tempMinistry}.<br>
  תמצית התיקון:<br>
  ${tempDescription}<br>
  ${tempExpirationDate} באמצעות הקישור שלהלן:<br>
  אתר החקיקה הממשלתי - ${tempName} <br>
  ${tempLink}
  <br>
  `;
};

const template17: TemplateType = (post: ISinglePost) => {
  const tempFileName = post.file_name ? post.file_name : dash;
  const tempFileDate = post.file_date ? post.file_date : dash;
  const titlesKeys = post.title_and_page
    ? Object.keys(post.title_and_page)
    : null;
  const tempTitles = titlesKeys
    ? titlesKeys
        .map((key: string) => {
          return `בעמ' ${key} - ${post.title_and_page[key]} <br>`;
        })
        .join("")
    : dash;
  return `
  ${templateBoundary}
  מצ"ב קובץ התקנות מס' ${tempFileName} שפורסם בתאריך ${tempFileDate} בו מפורסמות:<br> 
   ${tempTitles}
   <br>
   `;
};

const template18: TemplateType = (post: ISinglePost) => {
  const tempFileName = post.file_name ? post.file_name : dash;
  const tempFileDate = post.file_date ? post.file_date : dash;
  const titlesKeys = post.title_and_page
    ? Object.keys(post.title_and_page)
    : null;
  const tempTitles = titlesKeys
    ? titlesKeys
        .map((key: string) => {
          return `בעמ' ${key} - ${post.title_and_page[key]} <br>`;
        })
        .join("")
    : dash;
  return `
  ${templateBoundary}
  מצ"ב קובץ התקנות חיקוקי שלטון מקומי מס' ${tempFileName} שפורסם בתאריך ${tempFileDate} בו מפורסמות:<br>
  ${tempTitles}
  <br>
  `;
};

const template19: TemplateType = (post: ISinglePost) => {
  const tempFileName = post.file_name ? post.file_name : dash;
  const tempFileDate = post.file_date ? post.file_date : dash;
  const titlesKeys = post.title_and_page
    ? Object.keys(post.title_and_page)
    : null;
  const tempTitles = titlesKeys
    ? titlesKeys
        .map((key: string) => {
          return `בעמ' ${key} - ${post.title_and_page[key]} <br>`;
        })
        .join("")
    : dash;
  return `
  ${templateBoundary}
  מצ"ב קובץ התקנות שיעורי מכס, מס קניה ותשלומי חובה מס' ${tempFileName} שפורסם בתאריך ${tempFileDate} בו מפורסמות:<br>
   ${tempTitles}
   <br>
   `;
};

const template20: TemplateType = (post: ISinglePost) => {
  const tempFileName = post.file_name ? post.file_name : dash;
  const tempFileDate = post.file_date ? post.file_date : dash;
  const titlesKeys = post.title_and_page
    ? Object.keys(post.title_and_page)
    : null;
  const tempTitles = titlesKeys
    ? titlesKeys
        .map((key: string) => {
          return `בעמ' ${key} - ${post.title_and_page[key]} <br>`;
        })
        .join("")
    : dash;
  return `
  ${templateBoundary}
  מצ"ב ילקוט הפרסומים מס' ${tempFileName} שפורסם בתאריך ${tempFileDate} בו מפורסמות:<br>
  ${tempTitles}
  <br>
  `;
};

const template21: TemplateType = (post: ISinglePost) => {
  const tempTitle = post.title ? post.title : dash;
  const tempSubTitle = post.sub_title ? post.sub_title : dash;
  const tempDescription = post.description ? post.description : dash;
  const tempTopic = post.topic ? post.topic : dash;
  const tempText = post.text ? post.text : dash;
  const templink_to_contant = post.link_to_contant
    ? post.link_to_contant
    : dash;
  const templink = post.link ? post.link : dash;
  const tempurl = post.url ? post.url : dash;
  const temproot_link = post.root_link ? post.root_link : dash;
  const tempfirst_link = post.first_link ? post.first_link : dash;

  return `
  ${templateBoundary}
    ${tempTitle} <br>
    ${tempSubTitle} <br>
    ${tempDescription} <br>
    ${tempTopic} <br>
    ${tempText} <br>
    לינק כתבה:<br>
    ${templink_to_contant} <br>
    ${templink} <br>
    ${tempurl} <br>
    ${temproot_link} <br>
    ${tempfirst_link} <br>
    <br>
  `;
};

const template22: TemplateType = (post: ISinglePost) => {
  const tempName = post?.name ? post.name : dash;
  const templink = post?.page_link
    ? `<a href="${post.page_link}">${post.page_link}</a>`
    : dash;
  const tempDesc = post?.description ? post.description : dash;
  const tempExpData = post?.exp_date ? post.exp_date : dash;
  return `
  ${templateBoundary}
מצ"ב<br>
${tempName}<br>
תמצית התיקון<br>
${tempDesc} <br>
${tempExpData} 
באמצעות הקישור שלהלן : 
${templink} <br>
<br>
  `;
};

//Options
export const singleTemplatesOptions: TemplateOptionType[] = [
  { item: "", value: 0 },
  {
    item: 'כנסת: הפצת לו"ז לעדכון בודד',
    value: 1,
    tag: "כנסת",
    cat: "ישיבות הוועדות",
  },
  //{ item: "", value: 2 },
  {
    item: "כנסת: הודעה לעיתונות",
    value: 3,
    tag: "כנסת",
    cat: "הודעות לעיתונות",
  },
  {
    item: "כנסת: פרוטוקול דיוני ועדות",
    value: 4,
    tag: "כנסת",
    cat: "ישיבות הוועדות",
  },
  //{ item: "", value: 5 },
  {
    item: "כנסת: הצעות חוק שהונחו לדיון",
    value: 6,
    tag: "כנסת",
    cat: "הצעות חוק",
  },
  //{ item: "", value: 7 },
  { item: "כנסת: שאילתות", value: 8, tag: "כנסת", cat: "שאילתות" },
  {
    item: "כנסת: הצעות לסדר יום",
    value: 9,
    tag: "כנסת",
    cat: "הצעות לסדר-יום",
  },
  {
    item: "כנסת: פרוטוקולים",
    value: 10,
    tag: "כנסת",
    cat: "ישיבות המליאה",
  },
  {
    item: "כנסת: דיון מהיר",
    value: 11,
    tag: "כנסת",
    cat: "הצעות לסדר-יום",
  },
  {
    item: "ממשלה: ישיבת ממשלה – סדר יום",
    value: 12,
    tag: "ממשלה",
    cat: "סדר היום לישיבת הממשלה",
  },
  {
    item: "ממשלה: סיכום ישיבת ממשלה",
    value: 13,
    tag: "ממשלה",
    cat: "הודעות מזכיר הממשלה",
  },
  {
    item: "ממשלה: סדר יום ועדת שרים לענייני חקיקה",
    value: 14,
    tag: "ממשלה",
    cat: "סדר יום ועדות שרים",
  },
  {
    item: "ממשלה: ועדת שרים לענייני חקיקה החלטות- שליחת החלטה פרטנית",
    value: 15,
    // Не нужен автовыбор, т.к. идентичен 14-му шаблону
    //tag: "ממשלה",
    //cat: "סדר יום ועדות שרים",
  },
  { item: "ממשלה: תזכיר חוק", value: 16, tag: "ממשלה", cat: "תזכיר חוק" },
  {
    item: "ממשלה: חקיקת משנה – קובץ תקנות",
    value: 17,
    tag: "ממשלה",
    cat: "קובץ תקנות",
  },
  {
    item: "ממשלה: חקיקת משנה - קובץ התקנות – שיעורי מכס, מס קניה ותשלומי חובה",
    value: 18,
    tag: "ממשלה",
    cat: "קובץ תקנות שיעורי מכס, מס קניה ותשלומי חובה",
  },
  {
    item: "ממשלה: חקיקת משנה – קובץ תקנות חיקוקי שלטון מקומי",
    value: 19,
    tag: "ממשלה",
    cat: "חיקוקי שלטון מקומי",
  },
  {
    item: "ממשלה: עדכוני חקיקה – ילקוט הפרסומים",
    value: 20,
    tag: "ממשלה",
    cat: "ילקוט פרסומים",
  },
  {
    item: "ידיעה מהתקשורת/הוספה ללא טמפלייט",
    value: 21,
  },
  {
    item: "אתר החקיקה הממשלתי: תזכיר חוק",
    value: 22,
    tag: "אתר החקיקה הממשלתי",
    cat: "פרסומים",
  },
];

type TemplateOptionType = {
  item: string;
  value: keyof typeof singleTemplates;
  tag?: string;
  cat?: string;
};

// Templates Object
export const singleTemplates: { [key: string]: TemplateType } = {
  0: template0,
  1: template1,
  3: template3,
  4: template4,
  6: template6,
  8: template8,
  9: template9,
  10: template10,
  11: template11,
  12: template12,
  13: template13,
  14: template14,
  15: template15,
  16: template16,
  17: template17,
  18: template18,
  19: template19,
  20: template20,
  21: template21,
  22: template22,
};

export const emailTitles: { [key: string]: TemplateType } = {
  0: (post: ISinglePost) => {
    return ``;
  },
  1: (post: ISinglePost) => {
    return `עדכון מהכנסת – ${post.committee ? post.committee : dash}`;
  },
  3: (post: ISinglePost) => {
    console.log(post._sender)
    const start = post._sender === 'press_release' ? 'חדשות הכנסת-' : 'עדכון מהכנסת -'
    return `${start} ${post.title ? post.title : dash}`;
  },
  4: (post: ISinglePost) => {
    return `עדכון מהכנסת – פרוטוקול ועדה`;
  },
  6: (post: ISinglePost) => {
    return `עדכון מהכנסת – הצעות חוק שהונחו לדיון`;
  },
  8: (post: ISinglePost) => {
    return `עדכון מהכנסת – שאילתות`;
  },
  9: (post: ISinglePost) => {
    return `עדכון מהכנסת – הצעות לסדר יום`;
  },
  10: (post: ISinglePost) => {
    return `עדכון מהכנסת – פרוטוקול מליאה`;
  },
  11: (post: ISinglePost) => {
    return `עדכון מהכנסת – דיון מהיר`;
  },
  12: (post: ISinglePost) => {
    return `ישיבת ממשלה – סדר יום`;
  },
  13: (post: ISinglePost) => {
    return `ישיבת ממשלה – סיכום`;
  },
  14: (post: ISinglePost) => {
    return `ועדת שרים לענייני חקיקה – סדר יום`;
  },
  15: (post: ISinglePost) => {
    return `ועדת שרים לענייני חקיקה – החלטות`;
  },
  16: (post: ISinglePost) => {
    const tempName = post.name ? post.name : dash;
    return `תזכיר חוק ${tempName}`;
  },
  17: (post: ISinglePost) => {
    const tempName = post.name ? post.name : dash;
    return `כותרת: חקיקת משנה – קובץ תקנות מס' ${tempName}`;
  },
  18: (post: ISinglePost) => {
    return `חקיקת משנה – קובץ תקנות חיקוקי שלטון מקומי `;
  },
  19: (post: ISinglePost) => {
    return `חקיקת משנה - קובץ התקנות – שיעורי מכס, מס קניה ותשלומי חובה`;
  },
  20: (post: ISinglePost) => {
    return `עדכוני חקיקה – ילקוט הפרסומים`;
  },
  21: (post: ISinglePost) => {
    return ``;
  },
  22: (post: ISinglePost) => {
    const tempName = post.name ? post.name : dash;
    return tempName;
  },
};

//This function takes templateText and inserts into editor's content - after previous content and before signature
//Also inserts '**' between templates, (insertMultiTemplateText does not add '***')
export const insertSingleTemplateText = (
  currentText: string,
  templateText: string
): string => {
  const row = currentText.split(SignatureStart);
  if (currentText.includes(templateBoundary)) {
    templateText = "<br><br><p>***</p>" + templateText;
  }
  return [row[0] + templateText, row[1]].join(SignatureStart);
};
