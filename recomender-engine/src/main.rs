#[macro_use]
extern crate rocket;

use rocket::serde::json::Value;
use rocket::http::{CookieJar, Status};
use rocket::serde::json::{json};
use sqlx::MySqlPool;
use crate::db::types::Post;
use rocket_cors::{AllowedOrigins, CorsOptions};


mod engine;
mod db;
mod auth;
mod env;

#[get("/?<page>")]
async fn index<'a>(cookies: &CookieJar<'_>, page: u32, pool: &rocket::State<MySqlPool>, top_posts: &rocket::State<Vec<Post>>, config: &rocket::State<env::Config>) -> (Status, Value) {
    let session = auth::check(cookies.get("__Secure-next-auth.session-token"), &config.auth_url).await;
    if session == Value::Null {
        let generic_posts = engine::get_generic_posts(top_posts.to_vec(), page).await;
        return (Status::Ok, json!({ "message": "Credentials were invalid so generic posts are returned", "data": generic_posts }));
    }

    let posts = engine::get_customised_posts(pool, top_posts.to_vec(), session.get("user").unwrap().get("id").unwrap().as_str().unwrap(), page).await;

    (Status::Ok, json!({ "message": "Successfully requested posts", "data": posts }))
}

fn cors_options() -> CorsOptions {
    CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allow_credentials: true,
        ..Default::default()
    }
}


#[launch]
async fn rocket() -> _ {
    let config = env::Config::from_env().expect("Failed to load configuration");

    rocket::build()
        .attach(cors_options().to_cors().expect("Failed to attach CORS"))
        .manage(config.clone())
        .manage::<MySqlPool>(db::create_pool(&config.db_url).await)
        .manage::<Vec<Post>>(engine::generate_top_posts(&config.db_url).await)
        .mount("/", routes![index])
}