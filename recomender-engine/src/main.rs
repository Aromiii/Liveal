#[macro_use]
extern crate rocket;
use rocket::http::{CookieJar, Status};
use rocket::serde::json::{json, serde_json};
use sqlx::MySqlPool;
use crate::db::types::Post;

mod engine;
mod db;
mod auth;

#[get("/")]
async fn index<'a>(cookies: &CookieJar<'_>, pool: &rocket::State<MySqlPool>) -> (Status, serde_json::value::Value) {
    if !auth::check(cookies.get("__Secure-next-auth.session-token")).await {
        return (Status::Unauthorized, json!({ "message": "Header next-auth.session-token not provided or its invalid" }));
    }

    let posts = db::get_posts(pool).await;

    (Status::Ok, json!(posts))
}

#[launch]
async fn rocket() -> _ {
    rocket::build()
        .manage::<MySqlPool>(db::create_pool().await)
        .mount("/", routes![index])
}