use sqlx::{MySql, MySqlPool, Pool, pool};
use crate::db;
use crate::db::types::{Post, PostWithAverage};

pub async fn get_posts(pool: &rocket::State<MySqlPool>, top_posts: Vec<PostWithAverage>, user_id: String) -> Vec<Post> {
    let posts = db::get_all_posts(pool).await;

    return posts;
}

// TODO get pool somehow to fetch data from the db
pub async fn generate_top_posts() -> Vec<PostWithAverage> {
    let pool = db::create_pool().await;

    let data: Vec<PostWithAverage> = sqlx::query_as!(PostWithAverage, "SELECT content, id, likes, (rating * ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) * likes) / 2 AS average FROM Post ORDER BY average DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();
        

    return data;
}