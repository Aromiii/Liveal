use sqlx::MySqlPool;
use crate::db;
use crate::db::types::Post;

pub async fn get_posts(pool: &rocket::State<MySqlPool>, user_id: String) -> Vec<Post> {
    let posts = db::get_all_posts(pool).await;

    return posts;
}