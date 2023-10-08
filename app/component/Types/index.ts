export interface AuthState {
  userData: {
    user: {
      isAuth: boolean;
      isadmin: boolean;
      username: string;
      email?: string,
      uid?: string,
      userImage?: string;
      strikes: number,
      isbanned:boolean,
    }
  }
}
// https://stackoverflow.com/questions/39256682/how-to-define-an-interface-for-objects-with-dynamic-keys
export interface Tag {
  [key: string]: number,

}
export interface Reply {
  id: string,
  commentIdRef: string,
  username: string,
  userImage: string,
  score: number,
  replyText: string,
  storyTitle: string,
  storyId: string,
}
export interface Comment {
  id: string,
  commentrefid ?: string,
  username: string;
  userimage: string;
  text: string;
  storyid: string;
  storytitle: string;
  score: number;
  replies: Reply [];
  isreply: boolean,
}

export interface Story {
  username: string,
  title: string,
  tags: Tag[] | string,
  id: string,
  text: string
  reactions: {[key: string]: number}
}

export interface CommentLike {
  id: string,
  score: 0 | 1 | -1,
  commentid: string,
  username: string,
}

export interface StoryReaction {
  id: string,
  username: string,
  storyid: string,
  storyauthor: string,
  storytitle: string,
  reaction: string,
}

export interface UserReport {
  id:string,
  commentid: string,
  reporttype: string,
  contentid: string,
  username: string,
  created_at: string,
  offense: string,
}