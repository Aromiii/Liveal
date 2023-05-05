#[macro_use] extern crate rocket;

#[get("/")]
fn base() -> String {
    format!("Hello from Liveal's rust api")
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![base])
}