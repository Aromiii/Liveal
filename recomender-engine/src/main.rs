#[macro_use] extern crate rocket;

use sqlx::*;

mod rate_post;

#[derive(Debug)]
struct Post {
    id: String,
    content: String,
    likes: i32,
}

#[get("/")]
async fn index(pool: &rocket::State<MySqlPool>) -> String {
    let data = sqlx::query!("SELECT content, id, likes FROM Post")
        .fetch_all(pool.inner())
        .await.expect("Unable to query Post table");

    format!("{:?}", data)
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