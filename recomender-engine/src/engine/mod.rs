use sqlx::{MySqlPool};
use crate::db;
use crate::db::types::{PostWithRating};
use rand::thread_rng;
use rand::seq::SliceRandom;

pub async fn get_posts(pool: &rocket::State<MySqlPool>, mut top_posts: Vec<PostWithRating>, user_id: &str) -> Vec<PostWithRating> {
    let mut posts = sqlx::query_as!(PostWithRating, "SELECT Post.id, Post.content, Post.likes, User.username, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id JOIN Friendship f1 ON f1.user1Id = Post.userId OR f1.user2Id = Post.userId JOIN Friendship f2 ON (f2.user1Id = Post.userId OR f2.user2Id = Post.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE Post.userId != ? ORDER BY rating DESC;", user_id, user_id, user_id)
        .fetch_all(pool.inner())
        .await.unwrap();

    posts.append(&mut top_posts);
    posts.sort_by(|a, b| b.rating.unwrap().total_cmp(&a.rating.unwrap()));
    posts.dedup_by(|a, b| a.id == b.id);
    posts.shuffle(&mut thread_rng());

    return posts;
}

// TODO get pool somehow to fetch data from the db
pub async fn generate_top_posts() -> Vec<PostWithRating> {
    let pool = db::create_pool().await;

    let data= sqlx::query_as!(PostWithRating, "SELECT Post.id, Post.content, Post.likes, User.username, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id ORDER BY rating DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();


    return data;
}