import { prisma } from "../server/db";

export async function getLikes(userId: string, posts: { id: string }[]) {
  let formattedLikedPosts: string[] = [];

  if (userId) {
    const likedPosts = await prisma.like.findMany({
      where: {
        postId: {
          in: posts.map(post => {
            return post.id;
          })
        },
        userId: userId
      },
      select: { postId: true }
    });

    formattedLikedPosts = likedPosts.map(likedPost => {
      return likedPost.postId;
    });
  }

  return formattedLikedPosts;
}