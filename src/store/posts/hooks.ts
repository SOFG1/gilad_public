import { useDispatch, useSelector } from "react-redux";
import { rootReducerType } from "..";
import {
  postsSetEditor,
  postsSendEmail,
  postsPostDelete,
  postsGetAllPosts,
  postsSetClientsFilter,
  postsSetFilter,
  postsGetHistory,
  postsClearHistory,
  postsUpdateNewPost,
  postsUpdateNewPosts,
  postsSaveDraft,
  postsSetCurrentDraft,
  postsGetDrafts,
  postsDeleteDraft,
  postsHistorySetSearchQuery,
  postsDeleteKeyword,
  postsAddWsPost,
  postsMarkAsViewed,
} from "./actions";
import { IEmail, ISinglePost, IPostsState, IDeletePost, FilterClient, FilterPosts, node, IHistoryEmail, IMultiPost } from "./types";
import { createChannel } from "../../api";
import { personToPositionTitle } from "../../utilites/personToPositionTitle";
import { commiteeSessionValidator } from "../../utilites/commiteeSessionValidator";

export const usePostsActions = () => {
  const dispatch = useDispatch();

  const onGetPosts = () => {
    dispatch(postsGetAllPosts())
  };

  // Add new posts from WebSocket
  const onWatchForPosts = (token: string) => {
    const channel: WebSocket = createChannel(token);
    channel.addEventListener('open', () => {
      console.log('ws-connected')
    })
    //Reconnect when connection is closed
    channel.addEventListener('close', () => {
      console.log('ws disconnected')
      setTimeout(() => {
        onWatchForPosts(token)
      }, 3000)
    })
    //Call close callback to attempt reconnect
    channel.addEventListener('error', () => {
      channel.close()
    })
    

    //Message listener
    channel.addEventListener('message', (e: any) => {
      if (e.data) {
        let {data, sender} = JSON.parse(e.data)
        if (data) {
      //    console.log('new post from WebSocket', data)
          //Custom titles for "press_release"
          if(sender === "press_release") {
            data = {...data, title: `חדשות הכנסת- ${data.title}`}
          }
          if(sender === "person_to_position") {
            data = personToPositionTitle(data)
          }
          if(sender === "committee_session" && !commiteeSessionValidator(data)) {
            return
          }
          // "postsUpdateNewPost" - doesn't add immediately, show orange button at first
         // dispatch(postsUpdateNewPost({...data, _sender: sender}))
         // "postsAddWsPost" - appends into posts immediately
         dispatch(postsAddWsPost({...data, _sender: sender}))
        }
      }
    })
  };

  const onUpdateNewPosts = () => {
    dispatch(postsUpdateNewPosts())
  }

  const onSetEditor = (post: ISinglePost | IMultiPost | null) => {
    dispatch(postsSetEditor(post));
  };

  const onSetClientsFilter = (client: FilterClient | null) => {
    dispatch(postsSetClientsFilter(client))
  }

  const onSendEmail = (email: IEmail) => {
    dispatch(postsSendEmail(email));
  };

  const onSaveDraft = (draft: IEmail) => {
    dispatch(postsSaveDraft(draft))
  }

  const onDeletePost = (payload: IDeletePost) => {
    dispatch(postsPostDelete(payload));
  };


  const onApplyFilter = (params: FilterPosts) => {
    dispatch(postsSetFilter(params))
  }

  const onGetHistory = () => {
    dispatch(postsGetHistory())
  }

  const onSetSearchQuery = (query: string) => {
    dispatch(postsHistorySetSearchQuery(query))
  }

  const onClearHistory= () => {
    dispatch(postsClearHistory())
  }

  const onMarkAsViewed = (sender: node, id: number) => {
    dispatch(postsMarkAsViewed({sender, id}))
  }

  const onSetCurrentDraft = (draft: IHistoryEmail | null) => {
    dispatch(postsSetCurrentDraft(draft))
  }

  const onGetDrafts = () => {
    dispatch(postsGetDrafts())
  }

  const onDeleteDraft = (draftId: number) => {
    dispatch(postsDeleteDraft(draftId))
  }

  const onDeletePostKeyword = (sender: node, postId: number, keywordId: number) => {
    dispatch(postsDeleteKeyword({sender, postId, keywordId}))
  }

  return {
    onGetPosts,
    onUpdateNewPosts,
    onSetClientsFilter,
    onDeletePost,
    onWatchForPosts,
    onSetEditor,
    onSendEmail,
    onApplyFilter,
    onGetHistory,
    onSetSearchQuery,
    onClearHistory,
    onMarkAsViewed,
    onSaveDraft,
    onSetCurrentDraft,
    onGetDrafts,
    onDeleteDraft,
    onDeletePostKeyword
  };
};
