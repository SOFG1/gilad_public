import { ISinglePost } from "../../store/posts";
import { composeMultiPosts } from "../../utilites/composeMultiPosts";
import SinglePosts from './posts.json'
import Result from './multipostsResult.json'


it("test case #1", () => {
    //@ts-ignore
    const result = composeMultiPosts(SinglePosts)
    expect(result).toEqual(Result)
});




export {};
