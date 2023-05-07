#[macro_use]
extern crate rocket;

mod rate_post;

use sqlx::*;

mod db;
use db::types::Post;

#[get("/")]
async fn index(pool: &rocket::State<MySqlPool>) -> String {
    let posts: Vec<Post> = db::get_posts(pool).await;

    format!("{:#?}", posts)
}

#[launch]
async fn rocket() -> _ {
    let database_url = "mysql://127.0.0.1:3306";
    let pool = MySqlPool::connect(database_url)
        .await
        .expect("Failed to connect to database");

    rocket::build()
        .manage::<MySqlPool>(pool)
        .mount("/", routes![index])
}