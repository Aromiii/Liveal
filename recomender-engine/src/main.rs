#[macro_use]
extern crate rocket;

use sqlx::*;

mod rate_post;
mod get_posts;

#[derive(Debug)]
pub struct Post {
    id: String,
    content: String,
    likes: i32,
}

#[get("/")]
async fn index(pool: &rocket::State<MySqlPool>) -> String {
    let posts = get_posts::get_posts(pool).await;

    format!("{:#?}", posts)
}

#[launch]
async fn rocket() -> _ {
    let database_url = "mysql://127.0.0.1:3306";
    let pool = sqlx::MySqlPool::connect(database_url)
        .await
        .expect("Failed to connect to database");

    rocket::build()
        .manage::<MySqlPool>(pool)
        .mount("/", routes![index])
}