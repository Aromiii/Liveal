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
      updatedAt: true,
      author: {
        select: {
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
      updatedAt: comment.updatedAt.toLocaleString()
    };
  });
}