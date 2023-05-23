use std::env;
use sqlx::{MySql, MySqlPool, Pool};

pub async fn create_pool() -> Pool<MySql> {
    dotenv::dotenv().ok();

    // Access the environment variable
    let database_url = match env::var("DATABASE_URL") {
        Ok(value) => value,
        Err(e) => e.to_string()
    };

    let pool = MySqlPool::connect(&*database_url)
        .await
        .expect("Failed to connect to database");

    return pool;
}

pub mod types;