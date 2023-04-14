export default interface Post {
  postId: string,
  postLikes: number,
  authorName: string | null,
  authorUsername: string | null,
  authorImage: string | null,
  text: string,
  image: string,
  createdAt: string,
  liked: boolean,
  comments: {
    updatedAt: string,
    id: string,
    author: {
      image: string | null,
      name: string | null,
      username: string | null
    },
    content: string,
    postId: string
  }[]
}