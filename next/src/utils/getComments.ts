import { prisma } from "../server/db";

export async function getComments(posts: { id: string }[]) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: {
        in: posts.map(post => {
          return post.id;
        })
      }
    },
    select: {
      id: true,
      postId: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true
        }
      }
    }
  });

  return comments.map(comment => {
    return {
      ...comment,
      createdAt: comment.createdAt.toLocaleString()
    };
  });
}