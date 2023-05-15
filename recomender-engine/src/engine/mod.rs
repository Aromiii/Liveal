use rocket::log::private::kv::ToValue;
use sqlx::{MySql, MySqlPool, Pool, pool};
use crate::db;
use crate::db::types::{Post, PostWithRating};

pub async fn get_posts(pool: &rocket::State<MySqlPool>, mut top_posts: Vec<PostWithRating>, user_id: &str) -> Vec<PostWithRating> {
    let mut posts = sqlx::query_as!(PostWithRating, "SELECT p.id, p.content, p.likes, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = p.id) * 1.5) + likes) AS rating FROM Post p JOIN Friendship f1 ON f1.user1Id = p.userId OR f1.user2Id = p.userId JOIN Friendship f2 ON (f2.user1Id = p.userId OR f2.user2Id = p.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE p.userId != ? ORDER BY rating DESC", user_id, user_id, user_id)
        .fetch_all(pool.inner())
        .await.unwrap();

    posts.append(&mut top_posts);
    posts.sort_by(|a, b| b.rating.unwrap().total_cmp(&a.rating.unwrap()));
    posts.dedup_by(|a, b| a.id == b.id);

    return posts;
}

// TODO get pool somehow to fetch data from the db
pub async fn generate_top_posts() -> Vec<PostWithRating> {
    let pool = db::create_pool().await;

    let data= sqlx::query_as!(PostWithRating, "SELECT content, id, likes, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + likes) AS rating FROM Post ORDER BY rating DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();


    return data;
}