import { compareNumArrays, convertStringToDate, getFormatDate } from "."
import { IPostCardClient } from "../store/clients";
import { IMultiPost, ISinglePost } from "../store/posts"
import { checkDateInWeek } from "./checkDateInWeek"
import { convertStrDateToWeeks } from "./convertDateToWeeks";
import { getMondayFromWeek } from "./getMondayFromWeek";

const status104 = "הונחה על שולחן הכנסת לדיון מוקדם";


export const composeMultiPosts = (posts: ISinglePost[]): IMultiPost[] => {
    
    //Step1 filter correct status and date in week
    const postsFiltered = [...posts].filter(p => {
        const lastUpdatedDate = convertStringToDate(p.last_updated_date)
        const dateIsCorrect = checkDateInWeek(lastUpdatedDate, '3 01:00', '1 17:00')
        //Date should be between Wednesday 01:00 and Monday 17:00
        if(!dateIsCorrect) return false
        //Status should be 104
        if(p.status !== status104) return false
        return true
    })



    
    //Step2 compose groups of posts with same week and clients
    const multiPosts: IMultiPost[] = []
    let stack = [...postsFiltered]

    postsFiltered.forEach(post => {
        const postClientsIds = post.clients.map((c: any) => c.id)
        const postWeeks = convertStrDateToWeeks(post.last_updated_date)
        const alreadyAdded = multiPosts.some(m => {
            return m.posts.some(p => post.id === p.id)
        })
        if(alreadyAdded) return
        const posts = stack.filter(current => {
            const currentWeeks = convertStrDateToWeeks(current.last_updated_date)
            const sameWeeks = currentWeeks === postWeeks
            if(!sameWeeks) return false
            const currentClients = current.clients.map((c: any) => c.id)
            const sameClients = compareNumArrays(postClientsIds, currentClients)
            if(!sameClients) return false
            return true
        })
        const multiPost: IMultiPost = {
            title: comoposeTitle(post),
            clients: post.clients,
            last_updated_date: post.last_updated_date,
            lastUpdatedInWeeks: postWeeks, 
            posts: posts,
            date_for_sorting: Math.max(...posts.map(p => p.date_for_sorting)),
            _type: 'multipost'
        }
        if(multiPost.posts.length > 1) multiPosts.push(multiPost)
    })
    return multiPosts
}




function comoposeTitle (post: ISinglePost): string {
    const clientsNames = post.clients.length ? post.clients.map((c: IPostCardClient) => c.name).join(', ') : 'הצעות חוק שלא שויכו ללקוח'
    const lastUpdatedDateInWeeks = convertStrDateToWeeks(post.last_updated_date)
    const mondayDate = getFormatDate(getMondayFromWeek(lastUpdatedDateInWeeks))
    return `ריכוז הצעות חקיקה- ${clientsNames} עדכון מהכנסת- הצעות חוק שהונחו ביום שני ${mondayDate}`
}