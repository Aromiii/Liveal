use sqlx::{MySql, MySqlPool, Pool};
use crate::db;
use crate::db::types::Post;

pub async fn get_posts(pool: &rocket::State<MySqlPool>, user_id: String) -> Vec<Post> {
    let posts = db::get_all_posts(pool).await;

    return posts;
}

// TODO get pool somehow to fetch data from the db
pub async fn top_posts(pool: Pool<MySql>) -> Vec<Post> {
    let data: Vec<Post> = sqlx::query_as!(Post, "SELECT content, id, likes, ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) + likes) / 2 AS average FROM Post ORDER BY average DESC LIMIT 1000;")
        .fetch_all(pool)
        .await.expect("Unable to query Post table");

    return data;
}