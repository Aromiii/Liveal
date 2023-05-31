use std::env;
use sqlx::{MySql, MySqlPool, Pool};
use crate::db::types::Like;

pub async fn create_pool(database_url: &str) -> Pool<MySql> {
    let pool = MySqlPool::connect(&*database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub async fn get_likes(post_ids: Vec<String>, pool: &MySqlPool) -> Vec<Like> {
    let likes = sqlx::query_as!(types::Like, "SELECT userId AS user_id, postId AS post_id, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at FROM `Like` WHERE postId IN (?)", post_ids)
        .fetch_all(pool)
        .await.unwrap();


    return likes;
}

pub mod types;