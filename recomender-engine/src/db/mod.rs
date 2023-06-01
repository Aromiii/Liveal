use std::env;
use sqlx::{MySql, MySqlPool, Pool, query_as};
use crate::db::types::{Comment, Like};

pub async fn create_pool(database_url: &str) -> Pool<MySql> {
    let pool = MySqlPool::connect(&*database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub async fn get_likes(post_ids: &Vec<String>, pool: &MySqlPool) -> Vec<Like> {
    let post_ids: Vec<&str> = post_ids.iter().map(|id| id.as_str()).collect();

    let placeholders = post_ids.iter().map(|_| "?").collect::<Vec<&str>>().join(",");
    let query_str = format!("SELECT userId AS user_id, postId AS post_id, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at FROM `Like` WHERE postId IN ({})", placeholders);

    let mut query = query_as::<MySql, Like>(&query_str);
    for id in post_ids {
        query = query.bind(id);
    }

    let likes = query
        .fetch_all(pool)
        .await.unwrap();

    likes
}

pub async fn get_comments(post_ids: &Vec<String>, pool: &MySqlPool) -> Vec<Comment> {
    let post_ids: Vec<&str> = post_ids.iter().map(|id| id.as_str()).collect();

    let placeholders = post_ids.iter().map(|_| "?").collect::<Vec<&str>>().join(",");
    let query_str = format!("SELECT userId AS user_id, content, postId AS post_id, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS created_at FROM `Comment` WHERE postId IN ({})", placeholders);

    let mut query = query_as::<MySql, Comment>(&query_str);
    for id in post_ids {
        query = query.bind(id);
    }

    let comments = query
        .fetch_all(pool)
        .await.unwrap();

    comments
}



pub mod types;