use sqlx::{MySql, MySqlPool, Pool, pool};
use crate::db;
use crate::db::types::{Post, PostWithRating};

pub async fn get_posts(pool: &rocket::State<MySqlPool>, top_posts: Vec<PostWithRating>, user_id: &str) -> Vec<Post> {
    let data = sqlx::query_as!(Post, "SELECT p.id, p.content, p.likes FROM Post p JOIN Friendship f1 ON f1.user1Id = p.userId OR f1.user2Id = p.userId JOIN Friendship f2 ON (f2.user1Id = p.userId OR f2.user2Id = p.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE p.userId != ?", user_id, user_id, user_id)
        .fetch_all(pool.inner())
        .await.unwrap();

    println!("{:#?}", data);

    return data;
}

// TODO get pool somehow to fetch data from the db
pub async fn generate_top_posts() -> Vec<PostWithRating> {
    let pool = db::create_pool().await;

    let data= sqlx::query_as!(PostWithRating, "SELECT content, id, likes, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + likes) AS rating FROM Post ORDER BY rating DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();


    return data;
}