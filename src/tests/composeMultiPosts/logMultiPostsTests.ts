import { ISinglePost } from "../../store/posts";
import { compareNumArrays, convertStringToDate } from "../../utilites";
import { checkDateInWeek } from "../../utilites/checkDateInWeek";
import { composeMultiPosts } from "../../utilites/composeMultiPosts";
import { convertDateToWeeks } from "../../utilites/convertDateToWeeks";

const logMultiPostsTests = (allPosts: ISinglePost[]) => {
  //All
  console.log("1.all", allPosts.length);

  //CORRECT (status and date)
  const correctPosts = allPosts.filter((post) => {
    const lastUpdatedDate = convertStringToDate(post.last_updated_date);
    const dateIsCorrect = checkDateInWeek(
      lastUpdatedDate,
      "3 01:00",
      "1 17:00"
    );
    //Check date
    if (!dateIsCorrect) return false;
    //Check status
    if (post.status !== "הונחה על שולחן הכנסת לדיון מוקדם") return;
    return true;
  });
  console.log("2.correct", correctPosts.length);

  //Multiposts
  const mposts = composeMultiPosts(allPosts as ISinglePost[]);

  const totalInMposts = mposts.reduce((p, m) => p + m.posts.length, 0);
  console.log("3.in mposts", totalInMposts);

  ////////Use this in filter
  //Excluded
  const notInMposts = correctPosts.filter((post) => {
    let excluded = true;
    mposts.forEach((m) => {
      m.posts.forEach((p) => {
        if (post.id === p.id) excluded = false;
      });
    });
    return excluded;
  });

  console.log("4.not in mposts", notInMposts.length);

  //Test excluded
  const excludedCorrect = notInMposts.filter((p) => {
    const lastUpdatedDate = convertStringToDate(p.last_updated_date);
    const dateIsCorrect = checkDateInWeek(
      lastUpdatedDate,
      "3 01:00",
      "1 17:00"
    );
    //Check date
    if (!dateIsCorrect) return false;
    //Check status
    if (p.status !== "הונחה על שולחן הכנסת לדיון מוקדם") return;
    return true;
  });

  //Test only correct
  const wrong: any[] = [];
  excludedCorrect.forEach((post) => {
    //Data
    const lastUpdatedDate = convertStringToDate(post.last_updated_date);
    const lastUpdatedDateInWeeks = convertDateToWeeks(lastUpdatedDate);
    //Data
    const onlyOther = excludedCorrect.filter((p) => p.id !== post.id);

    //Test
    let error: any = false;
    onlyOther.forEach((f) => {
      const isOnSameWeek =
        lastUpdatedDateInWeeks ===
        convertDateToWeeks(convertStringToDate(f.last_updated_date));
      const clientsMatch = compareNumArrays(
        post.clients.map((c: any) => c.id),
        f.clients.map((c: any) => c.id)
      );
      if (isOnSameWeek && clientsMatch) {
        error = true;
      }
    });
    if (error) wrong.push(post);
  });

  console.log("5.wrong excluded", wrong.length);

  // Only posts that are not in multiposts
  const billSingleFiltered = allPosts.filter((post) => {
    let isInMPosts = false;
    mposts.forEach((m) => {
      m.posts.forEach((p) => {
        if (p.id === post.id) isInMPosts = true;
      });
    });
    return !isInMPosts;
  });

  console.log("6.single", billSingleFiltered.length);
};

export default logMultiPostsTests;
