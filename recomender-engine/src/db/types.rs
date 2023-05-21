use rocket::serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Post {
    pub(crate) id: String,
    pub(crate) content: String,
    pub(crate) likes: i32,
    pub(crate) username: Option<String>,
    pub(crate) name: Option<String>,
    pub(crate) user_image: Option<String>,
    pub(crate) created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PostWithRating {
    pub(crate) id: String,
    pub(crate) content: String,
    pub(crate) likes: i32,
    pub(crate) rating: Option<f64>,
    pub(crate) username: Option<String>,
    pub(crate) name: Option<String>,
    pub(crate) user_image: Option<String>,
    pub(crate) created_at: Option<String>,
}
