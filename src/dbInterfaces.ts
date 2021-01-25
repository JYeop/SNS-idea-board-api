export interface IPost {
  writerUid: string;
  name: string;
  body: string;
  categories: string[];
  read: number;
  comments: number;
  likes: number;
  createdAt: number;
  // 비공개글에 사용하려고 했는데, 굳이 필요한것 같진 않아 현재는 쓰지않음.
  visible: boolean;
  imageUrls?: string[];
  thumbnailUrls?: string[];
}

export interface IPostComment {
  writerUid: string;
  postId: string;
  name: string;
  body: string;
  likes: number;
  subComments: number;
  createdAt: number;
  parentComment: string | null;
}

export interface IPostLike {
  // 좋아요 누른사람의 uid
  uid: string;
  postId: string;
  createdAt: number;
}

export interface IPostCommentLike {
  // 좋아요 누른사람의 uid
  uid: string;
  postId: string;
  commentId: string;
  createdAt: number;
}

// eslint-disable-next-line no-unused-vars
enum REPORT_TYPE {
  post = 'post',
  comment = 'comment',
}

export interface IReport {
  type: REPORT_TYPE;
  postId: string | null;
  commentId: string | null;
  createdAt: string;
  reporterName: string;
  reporterUid: string;
}

export interface IUser {
  fcmToken?: string;
  receiveNotification: boolean;
  displayName: string;
  email?:string;
  profileImage?: string;
  phone?: string;
  verifiedPhone?: boolean;

}

// export enum LIKE_TYPES {
//   post = 'post',
//   comment = 'comment',
//
// }
// export interface ILike {
//   // 좋아요 누른사람의 uid
//   uid: string;
//   type: LIKE_TYPES;
//   targetId: string;
//   // postId: string | null;
//   // commentId: string | null;
//   createdAt: number;
// }
