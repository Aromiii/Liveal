use sqlx::{MySqlPool};
use crate::db;
use crate::db::types::{PostWithRating};
use rand::thread_rng;
use rand::seq::SliceRandom;

const PAGE_SIZE: u32 = 10;
const PERSONAL_POSTS_SIZE: u32 = 5;
const TOP_POSTS_SIZE: u32 = PAGE_SIZE - PERSONAL_POSTS_SIZE;

pub async fn get_generic_posts(top_posts: Vec<PostWithRating>, page_number: u32) -> Vec<PostWithRating> {
    return top_posts[(page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize].to_vec()
}

pub async fn get_customised_posts(pool: &rocket::State<MySqlPool>, top_posts: Vec<PostWithRating>, user_id: &str, page_number: u32) -> Vec<PostWithRating> {
    let mut posts = sqlx::query_as!(PostWithRating, "SELECT Post.id, Post.content, Post.likes, User.id as user_id, User.username, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id JOIN Friendship f1 ON f1.user1Id = Post.userId OR f1.user2Id = Post.userId JOIN Friendship f2 ON (f2.user1Id = Post.userId OR f2.user2Id = Post.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE Post.userId != ? ORDER BY rating DESC LIMIT ? OFFSET ?", user_id, user_id, user_id, PERSONAL_POSTS_SIZE, (page_number - 1) * PERSONAL_POSTS_SIZE)
        .fetch_all(pool.inner())
        .await.unwrap();

    posts.append(&mut top_posts[(page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize].to_vec());
    posts.sort_by(|a, b| b.rating.unwrap().total_cmp(&a.rating.unwrap()));
    posts.retain(|x| x.user_id != user_id);
    posts.dedup_by(|a, b| a.id == b.id);
    posts.shuffle(&mut thread_rng());

    return posts;
}

pub async fn generate_top_posts(db_url: &str) -> Vec<PostWithRating> {
    let pool = db::create_pool(db_url).await;

    let data = sqlx::query_as!(PostWithRating, "SELECT Post.id, Post.content, Post.likes, User.username, User.id as user_id, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id ORDER BY rating DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();


    return data;
}