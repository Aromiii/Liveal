use rocket::serde::{Serialize, Deserialize};

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
    pub(crate) user_id: String,
}
