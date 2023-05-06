//#[macro_use] extern crate rocket;

use mysql::*;
use mysql::prelude::*;

mod rate_post;

#[derive(Debug, PartialEq, Eq)]
struct Post {
    id: String,
    content: String,
    likes: i32,
}


/*#[get("/")]
fn index() -> String {
    format!("Hello from Liveal's rust api")
}

#[launch]
fn rocket() -> _ {
    let url = "mysql://c7q9azit0y937s1axvs2:pscale_pw_kkxyCU9eJkkwzzgXFzee6tZV3nB1dMLOtANqA63utns@aws.connect.psdb.cloud/liveal";
    let pool = Pool::new(url)?;

    let mut db = pool.get_conn()?;

    rocket::build().mount("/", routes![index])
}*/

fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    let url = "mysql://127.0.0.1:3306";
    let pool = Pool::new(url)?;

    let mut db = pool.get_conn()?;

    let selected_posts = db
        .query_map(
            "SELECT id, content, likes FROM Post",
            |(id, content, likes)| {
                Post { id, content, likes }
            },
        );

    println!("{:?}", selected_posts);

    Ok(())
}