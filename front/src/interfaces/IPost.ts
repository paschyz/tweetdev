export default interface IPost {
    authorName: string;
    content: string
    like: Like[]
    comments: any[]
    creationDate : string
    username: string
    hubname: string | undefined
  }

  export interface Like {
    username: string;
    emojiIndex: number;
}