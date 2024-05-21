import { SignatureParams } from "./types";

export const dash: string = "___ ";



// Greeting beginning of the email
export const greeting: string = `<p style='font-family: "David Libre";'>שלום רב,</p>`;




//this helps to detect templates' boundaries in text
export const templateBoundary = `<span class="template" style="font-size: 0px;"></span>`;







//We use this part of code in order to detect where the signature starts in the text
export const SignatureStart =
  '<div class="signature se-component se-image-container __se__float-right" contenteditable="false" style="margin-inline-end: 7px;">';







// Signature - this function takes user info and returns signature with image that will be pasted in the end of email
export const composeSignature = ({
    full_name,
    title,
    office_phone,
    mobile_phone,
    email,
    logo,
  }: SignatureParams): string => {
    //Return only custom image if user has it
    if (logo) {
      return `
      ${SignatureStart}
      <a href="https://www.gilad-lobbying.co.il/" target"_blank">
      <figure style="margin: auto auto auto 20px; float: right">
      <img
      src=" ${
        logo
          ? "https://gilad.stoi.co/" + logo
          : "https://gilad.stoi.co/media/images/logo.jpg"
      }"
      alt=""
      data-rotate=""
      data-proportion="true"
      data-rotatex=""
      data-rotatey=""
      data-align="right" 
      data-index="1" 
      data-origin="," 
      style="object-fit: contain;" 
      >
      </figure>
      </a>
      </div>
      `;
    }
    //Return default signature image composed using user_info
    return `
    ${SignatureStart}
      <figure style="margin: auto auto auto 20px; float: right">
      <img
      src="https://gilad.stoi.co/media/images/logo.jpg"
      alt=""
      data-rotate=""
      data-proportion="true"
      data-rotatex=""
      data-rotatey=""
      data-align="right" 
      data-index="1" 
      data-origin="," 
      style="width: 78px; height: 66px; object-fit: cover;" 
      >
      </figure>
      </div>
      <p style='line-height: 20px; font-family: "David Libre", sans-serif;'><b>בברכה,</b></p>
      <p style='line-height: 20px; font-family: "David Libre", sans-serif; font-weight: 700;'>${
        full_name ? full_name : ""
      } | ${
      title ? title : ""
    } | גלעד יחסי ממשל ולובינג | <a>www.gilad-lobbying.co.il</a></p>  
      <hr style="margin-top: 23px;">
      <p style='line-height: 12px; font-family: "David Libre", sans-serif;'>נייד: ${
        mobile_phone ? `<a href="tel: ${mobile_phone}">${mobile_phone}</a>` : ""
      } | קווי: ${
      office_phone ? `<a href="tel: ${office_phone}">${office_phone}</a>` : ""
    } |  פקס: 03-6124807 | ${
      email ? `<a href="mailto: ${email}">${email}</a>` : ""
    } </p>  
      `;
  };

