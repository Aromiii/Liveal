use rocket::serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Post {
    pub(crate) id: String,
    pub(crate) content: String,
    pub(crate) likes: i32,
    pub(crate) rating: Option<f64>,
    pub(crate) username: Option<String>,
    pub(crate) name: Option<String>,
    pub(crate) user_image: Option<String>,
    pub(crate) created_at: Option<String>,
    pub(crate) user_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PostWithAllData {
    pub(crate) id: String,
    pub(crate) content: String,
    pub(crate) likes: i32,
    pub(crate) liked: bool,
    pub(crate) rating: Option<f64>,
    pub(crate) author: Author,
    pub(crate) createdAt: Option<String>,
    pub(crate) comments: Vec<Comment>
}


#[derive(Debug, FromRow)]
pub struct Like {
    pub(crate) user_id: String,
    pub(crate) post_id: String,
    pub(crate) created_at: Option<String>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Comment {
    pub(crate) id: String,
    pub(crate) postId: String,
    pub(crate) content: String,
    pub(crate) createdAt: Option<String>,
    pub(crate) author: Author
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct RawComment {
    pub(crate) id: String,
    pub(crate) user_id: String,
    pub(crate) post_id: String,
    pub(crate) content: String,
    pub(crate) created_at: Option<String>,
    pub(crate) image: String,
    pub(crate) name: String,
    pub(crate) username: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Author {
    pub(crate) id: String,
    pub(crate) image: String,
    pub(crate) name: String,
    pub(crate) username: String
}
