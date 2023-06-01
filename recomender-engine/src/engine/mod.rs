use sqlx::{MySqlPool};
use crate::db;
use crate::db::types::{Author, Post, PostWithAllData};
use rand::thread_rng;
use rand::seq::SliceRandom;

const PAGE_SIZE: u32 = 10;
const PERSONAL_POSTS_SIZE: u32 = 5;
const TOP_POSTS_SIZE: u32 = PAGE_SIZE - PERSONAL_POSTS_SIZE;

pub async fn get_generic_posts(top_posts: Vec<Post>, page_number: u32) -> Vec<Post> {
    if (page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) < top_posts.len() as u32 {
        return top_posts[(page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize].to_vec()
    }

    return top_posts[0..TOP_POSTS_SIZE as usize].to_vec()
}

pub async fn get_customised_posts(pool: &rocket::State<MySqlPool>, top_posts: Vec<Post>, user_id: &str, page_number: u32) -> Vec<PostWithAllData> {
    let mut posts = sqlx::query_as!(Post, "SELECT Post.id, Post.content, Post.likes, User.id as user_id, User.username, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id JOIN Friendship f1 ON f1.user1Id = Post.userId OR f1.user2Id = Post.userId JOIN Friendship f2 ON (f2.user1Id = Post.userId OR f2.user2Id = Post.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE Post.userId != ? ORDER BY rating DESC LIMIT ? OFFSET ?", user_id, user_id, user_id, PERSONAL_POSTS_SIZE, page_number * PERSONAL_POSTS_SIZE)
        .fetch_all(pool.inner())
        .await.unwrap();

    posts.append(&mut top_posts[(page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize].to_vec());
    posts.sort_by(|a, b| b.rating.unwrap().total_cmp(&a.rating.unwrap()));
    posts.retain(|x| x.user_id != user_id);
    posts.dedup_by(|a, b| a.id == b.id);

    let post_ids = posts.iter().map(|post| post.id.clone()).collect();
    let likes = db::get_likes(&post_ids, pool.inner()).await;
    let comments = db::get_comments(&post_ids, pool.inner()).await;

    let mut posts_with_all: Vec<PostWithAllData> = vec![];

    for value in posts {
        let mut post_with_all = PostWithAllData {
            id: value.id.clone(),
            content: value.content,
            likes: value.likes,
            liked: false,
            rating: value.rating,
            author: Author {
                username: match value.username {
                    None => {"error".to_string()},
                    Some(x) => {x}
                },
                name: match value.name {
                    None => {"error".to_string()},
                    Some(x) => {x}
                },
                image: match value.user_image {
                    None => {"error".to_string()},
                    Some(x) => {x}
                },
                id: value.user_id.clone(),
            },
            created_at: value.created_at,
            comments: vec![]
        };

        for like in &likes {
            if value.id == like.post_id && value.user_id == user_id {
                post_with_all.liked = true;
            }
        }

        for comment in &comments {
            if value.id == comment.post_id {
                post_with_all.comments.push(comment.clone());
            }
        }

        posts_with_all.push(post_with_all);
    }

    posts_with_all.shuffle(&mut thread_rng());

    posts_with_all
}

pub async fn generate_top_posts(db_url: &str) -> Vec<Post> {
    let pool = db::create_pool(db_url).await;

    let data = sqlx::query_as!(Post, "SELECT Post.id, Post.content, Post.likes, User.username, User.id as user_id, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id ORDER BY rating DESC LIMIT 1000;")
        .fetch_all(&pool)
        .await
        .unwrap();


    return data;
}