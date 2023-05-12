#[macro_use]
extern crate rocket;

use rocket::serde::json::Value;
use rocket::http::{CookieJar, Status};
use rocket::serde::json::{json, serde_json};
use sqlx::MySqlPool;
use db::types::Post;
use crate::db::types::PostWithAverage;

mod engine;
mod db;
mod auth;

#[get("/")]
async fn index<'a>(cookies: &CookieJar<'_>, pool: &rocket::State<MySqlPool>, top_posts: &rocket::State<Vec<PostWithAverage>>) -> (Status, Value) {
    let session = auth::check(cookies.get("__Secure-next-auth.session-token")).await;
    if session == Value::Null {
        return (Status::Unauthorized, json!({ "message": "Header next-auth.session-token not provided or its invalid" }));
    }

    let posts = engine::get_posts(pool, top_posts.to_vec(), session.get("user").unwrap().get("id").unwrap().to_string()).await;

    (Status::Ok, json!({ "message": "Successfully requested posts", "data": posts }))
}

#[launch]
async fn rocket() -> _ {
    rocket::build()
        .manage::<MySqlPool>(db::create_pool().await)
        .manage::<Vec<PostWithAverage>>(engine::generate_top_posts().await)
        .mount("/", routes![index])
}