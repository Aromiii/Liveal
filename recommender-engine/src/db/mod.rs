use std::env;
use sqlx::{MySql, MySqlPool, Pool, query_as};
use crate::db::types::{Comment, Like, RawComment, Author};

pub async fn create_pool(database_url: &str) -> Pool<MySql> {
    let pool = MySqlPool::connect(&*database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub async fn get_likes(post_ids: &Vec<String>, pool: &MySqlPool) -> Vec<Like> {
    let post_ids: Vec<&str> = post_ids.iter().map(|id| id.as_str()).collect();

    let placeholders = post_ids.iter().map(|_| "?").collect::<Vec<&str>>().join(",");
    let query_str = format!("SELECT userId AS user_id, postId AS post_id, DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_at FROM `Like` WHERE postId IN ({})", placeholders);

    let mut query = query_as::<MySql, Like>(&query_str);
    for id in post_ids {
        query = query.bind(id);
    }

    let likes = query
        .fetch_all(pool)
        .await.expect("Error in likes query");

    likes
}

pub async fn get_comments(post_ids: &Vec<String>, pool: &MySqlPool) -> Vec<Comment> {
    let post_ids: Vec<&str> = post_ids.iter().map(|id| id.as_str()).collect();

    let placeholders = post_ids.iter().map(|_| "?").collect::<Vec<&str>>().join(",");
    let query_str = format!("SELECT c.userId AS user_id, c.id, c.content, c.postId AS post_id, DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_at, u.image, u.name, u.username FROM `Comment` AS c JOIN `User` AS u ON c.userId = u.id WHERE c.postId IN ({})", placeholders);

    let mut query = query_as::<MySql, RawComment>(&query_str);
    for id in post_ids {
        query = query.bind(id);
    }

    let raw_comments = query
        .fetch_all(pool)
        .await.expect("Error in comments query");

    let mut comments: Vec<Comment> = vec![];
    for raw in raw_comments {
        comments.push(Comment {
            postId: raw.post_id,
            content: raw.content,
            createdAt: raw.created_at,
            id: raw.id,
            author: Author {
                id: raw.user_id,
                image: raw.image,
                name: raw.name,
                username: raw.username,
            },
        })
    }

    comments
}



pub mod types;