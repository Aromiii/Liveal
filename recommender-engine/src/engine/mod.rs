use sqlx::{MySql, MySqlPool, Pool};
use crate::db;
use crate::db::types::{Author, Comment, Like, Post, PostWithAllData};
use rand::thread_rng;
use rand::seq::SliceRandom;
use rocket::State;

const PAGE_SIZE: u32 = 20;
const PERSONAL_POSTS_SIZE: u32 = 15;
const TOP_POSTS_SIZE: u32 = PAGE_SIZE - PERSONAL_POSTS_SIZE;

pub async fn get_generic_posts(top_posts: Vec<Post>, page_number: u32, pool: &State<MySqlPool>) -> Vec<PostWithAllData> {
    let mut post_chuck: Vec<Post> = vec![];

    if (page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) < top_posts.len() as u32 {
        post_chuck = top_posts[(page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize].to_vec()
    } else {
        post_chuck = top_posts[0..TOP_POSTS_SIZE as usize].to_vec()
    }

    let post_ids = post_chuck.iter().map(|post| post.id.clone()).collect();
    let likes = db::get_likes(&post_ids, pool.inner()).await;
    let comments = db::get_comments(&post_ids, pool.inner()).await;

    format_posts("", &mut post_chuck, &likes, &comments)
}

pub async fn get_customised_posts(pool: &rocket::State<MySqlPool>, top_posts: Vec<Post>, user_id: &str, page_number: u32) -> Vec<PostWithAllData> {
    let result = sqlx::query_as!(Post, "SELECT Post.id, Post.content, Post.likes, User.id as user_id, User.username, User.name, User.image AS user_image, DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_at, (rating + ((SELECT COUNT(*) FROM Comment WHERE postId = Post.id) * 1.5) + Post.likes) AS rating FROM Post JOIN User ON Post.userId = User.id JOIN Friendship f1 ON f1.user1Id = Post.userId OR f1.user2Id = Post.userId JOIN Friendship f2 ON (f2.user1Id = Post.userId OR f2.user2Id = Post.userId) AND (f2.user1Id = ? OR f2.user2Id = ?) WHERE Post.userId != ? ORDER BY rating DESC LIMIT ? OFFSET ?", user_id, user_id, user_id, PERSONAL_POSTS_SIZE, page_number * PERSONAL_POSTS_SIZE)
        .fetch_all(pool.inner())
        .await;

    let mut posts: Vec<Post> = match result {
        Ok(posts) => posts,
        Err(e) => {
            eprintln!("Error: {}", e);
            return vec![]
        }
    };

    let mut paginated_top_posts = match top_posts.get((page_number * TOP_POSTS_SIZE) as usize..(page_number * TOP_POSTS_SIZE + TOP_POSTS_SIZE) as usize) {
        Some(v) => v.to_vec() as Vec<Post>,
        None => {
            eprintln!("Error: Couldn't get top posts from memory. Array out of bounds");
            let mut error_posts = top_posts;
            error_posts.shuffle(&mut thread_rng());
            error_posts[0..TOP_POSTS_SIZE as usize].to_vec()
        }
    };

    posts.append(&mut paginated_top_posts);
    posts.sort_by(|a, b| b.rating.unwrap().total_cmp(&a.rating.unwrap()));
    posts.retain(|x| x.user_id != user_id);
    posts.dedup_by(|a, b| a.id == b.id);

    let post_ids = posts.iter().map(|post| post.id.clone()).collect();
    let likes = db::get_likes(&post_ids, pool.inner()).await;
    let comments = db::get_comments(&post_ids, pool.inner()).await;

    format_posts(user_id, &mut posts, &likes, &comments)
}

fn format_posts(user_id: &str, posts: &mut Vec<Post>, likes: &Vec<Like>, comments: &Vec<Comment>) -> Vec<PostWithAllData> {
    let mut posts_with_all: Vec<PostWithAllData> = vec![];

    for value in posts {
        let mut post_with_all = PostWithAllData {
            id: value.id.clone(),
            content: value.content.clone(),
            likes: value.likes,
            liked: false,
            rating: value.rating,
            author: Author {
                username: match value.username.clone() {
                    None => { "error".to_string() },
                    Some(x) => { x }
                },
                name: match value.name.clone() {
                    None => { "error".to_string() },
                    Some(x) => { x }
                },
                image: match value.user_image.clone() {
                    None => { "error".to_string() },
                    Some(x) => { x }
                },
                id: value.user_id.clone(),
            },
            createdAt: value.created_at.clone(),
            comments: vec![],
        };

        for like in likes {
            if value.id == like.post_id && value.user_id == user_id {
                post_with_all.liked = true;
            }
        }

        for comment in comments {
            if value.id == comment.postId {
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
        .await.expect("Error in top posts query");


    return data;
}