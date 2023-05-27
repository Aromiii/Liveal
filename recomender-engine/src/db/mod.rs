use std::env;
use sqlx::{MySql, MySqlPool, Pool};

pub async fn create_pool(database_url: &str) -> Pool<MySql> {
    let pool = MySqlPool::connect(&*database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub mod types;