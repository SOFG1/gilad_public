import { ISinglePost } from "../store/posts";

//This funciton adds title for posts from "person_to_position" source
export const personToPositionTitle = (post: ISinglePost): ISinglePost => {
  let title = "";
  if (post?.start_date !== null && post?.finish_date === null) {
    title = `ח"כ ${post?.person?.first_name} ${post?.person?.last_name} נכנס לתפקידו כ  ${post?.position_description}  של ${post?.committee}, בתאריך :  ${post?.start_date}`;
  }
  if (post?.start_date === null && post?.finish_date !== null) {
    title = `ח"כ ${post?.person?.first_name} ${post?.person?.last_name} יצא מתפקידו כ  ${post?.position_description}  של ${post?.committee}, בתאריך :  ${post?.finish_date}`;
  }
  return {
      ...post,
      title,
  }
};
