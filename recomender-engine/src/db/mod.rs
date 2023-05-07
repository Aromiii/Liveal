use sqlx::MySqlPool;
use crate::db::types::Post;

pub async fn get_posts(pool: &rocket::State<MySqlPool>) -> Vec<Post> {
    let data = sqlx::query!("SELECT content, id, likes FROM Post")
        .fetch_all(pool.inner())
        .await.expect("Unable to query Post table");

    let mut posts: Vec<Post> = vec![];

    for i in data.iter() {
        posts.push(Post {
            id: String::from_utf8((*i.id).to_vec()).unwrap(),
            content: String::from_utf8((*i.content).to_vec()).unwrap(),
            likes: i.likes,
        })
    };

    return posts;
}

pub mod types;