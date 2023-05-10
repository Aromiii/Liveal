use sqlx::{MySql, MySqlPool, Pool};
use crate::db::types::Post;

pub async fn get_all_posts(pool: &rocket::State<MySqlPool>) -> Vec<Post> {
    let data: Vec<Post> = sqlx::query_as!(Post, "SELECT content, id, likes FROM Post")
        .fetch_all(pool.inner())
        .await.expect("Unable to query Post table");

    return data;
}

pub async fn create_pool() -> Pool<MySql> {
    let database_url = "mysql://127.0.0.1:3306";
    let pool = MySqlPool::connect(database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub mod types;