#[macro_use]
extern crate rocket;

use rocket::serde::json::Value;
use rocket::http::{CookieJar, Status};
use rocket::serde::json::{json};
use sqlx::MySqlPool;
use crate::db::types::PostWithRating;

mod engine;
mod db;
mod auth;

#[get("/?<page>")]
async fn index<'a>(cookies: &CookieJar<'_>, page: u32, pool: &rocket::State<MySqlPool>, top_posts: &rocket::State<Vec<PostWithRating>>) -> (Status, Value) {
    let session = auth::check(cookies.get("__Secure-next-auth.session-token")).await;
    if session == Value::Null {
        return (Status::Ok, json!({ "message": "Credentials were invalid so generic posts are returned", "data": top_posts.to_vec() }));
    }

    let posts = engine::get_posts(pool,top_posts.to_vec(),session.get("user").unwrap().get("id").unwrap().as_str().unwrap(), page).await;

    (Status::Ok, json!({ "message": "Successfully requested posts", "data": posts }))
}

#[launch]
async fn rocket() -> _ {
    rocket::build()
        .manage::<MySqlPool>(db::create_pool().await)
        .manage::<Vec<PostWithRating>>(engine::generate_top_posts().await)
        .mount("/", routes![index])
}