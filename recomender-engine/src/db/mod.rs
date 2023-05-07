use sqlx::MySqlPool;
use crate::db::types::Post;

pub async fn get_posts(pool: &rocket::State<MySqlPool>) -> Vec<Post> {
    let data: Vec<Post> = sqlx::query_as!(Post, "SELECT content, id, likes FROM Post")
        .fetch_all(pool.inner())
        .await.expect("Unable to query Post table");

    return data;
}

pub mod types;