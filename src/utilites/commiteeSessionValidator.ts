import { ISinglePost } from "../store/posts";

//This funciton checks if post title valid or not from "committee_session"
export const commiteeSessionValidator = (post: ISinglePost): boolean => {
  let valid = true;
  if (post.title?.match("סטטוס פעיל")) {
    valid = false;
  }
  if (post.title?.match("מועד סיום")) {
  //  valid = false;
  }
  return valid;
};
