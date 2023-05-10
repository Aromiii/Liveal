#[macro_use]
extern crate rocket; 
use sqlx::*;
use rocket::http::CookieJar;

mod engine;
mod db;
mod auth;

#[get("/")]
async fn index(cookies: &CookieJar<'_>, pool: &rocket::State<MySqlPool>) -> String {
    if !auth::check(cookies.get("next-auth.session-token")).await {
        return format!("Not authenticated")
    }

    let posts = db::get_posts(pool).await;

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