export default interface Post {
  id: string,
  likes: number,
  author: {
    id: string,
    name: string | null,
    username: string | null,
    image: string | null,
  },
  content: string,
  image?: string,
  createdAt: string,
  liked: boolean,
  comments: {
    createdAt: string,
    id: string,
    author: {
      id: string,
      image: string | null,
      name: string | null,
      username: string | null
    },
    content: string,
    postId: string
  }[]
}