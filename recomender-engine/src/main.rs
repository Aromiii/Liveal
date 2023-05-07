#[macro_use]
extern crate rocket;

mod engine;


use rocket::Request;
use sqlx::*;

mod db;
use db::types::Post;
use crate::auth::check;

mod auth {
    async fn get_session() {
        let url = "http://localhost:3000/api/auth/session";

        let client = reqwest::Client::new();
        let response = client
            .get(url)
            .send()
            .await
            .expect("failed to get response")
            .text()
            .await
            .expect("failed to get payload");

        println!("{:#?}", response)
    }

    pub async fn check() {
        get_session().await;
    }
}

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