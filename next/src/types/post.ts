export default interface Post {
  id: string,
  likes: number,
  author: {
    name: string | null,
    username: string | null,
    image: string | null,
  },
  content: string,
  image?: string,
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