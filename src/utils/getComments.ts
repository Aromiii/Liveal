import { prisma } from "../server/db";

export async function getComments(posts) {
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

  const formattedComments = comments.map(comment => {
    return {
      ...comment,
      updatedAt: comment.updatedAt.toLocaleString()
    };
  });
  return formattedComments;
}