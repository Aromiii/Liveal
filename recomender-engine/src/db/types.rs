use rocket::serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Post {
    pub(crate) id: String,
    pub(crate) content: String,
    pub(crate) likes: i32,
}
