use rocket::http::Cookie;
use rocket::serde::json::{Value, serde_json};

async fn get_session(cookie: &Cookie<'_>, auth_url: &str) -> String {
    let client = reqwest::Client::new();
    let response = client
        .get(auth_url)
        .header(reqwest::header::COOKIE, cookie.to_string())
        .send()
        .await
        .expect("failed to get response")
        .text()
        .await
        .expect("failed to get payload");

    return response;
}

pub async fn check(cookie: Option<&Cookie<'_>>, auth_url: &str) -> Value {
    return match cookie {
        None => { Value::Null }
        Some(cookie) => {
            let session = get_session(cookie, auth_url).await;

            if session == "{}" {
                return Value::Null;
            }

            // Parse the JSON string
            let parsed_session: Result<Value, serde_json::Error> = serde_json::from_str(&session);

            // Check if parsing was successful
            match parsed_session {
                Ok(parsed_json) => {
                    parsed_json
                }
                Err(e) => {
                    println!("Error parsing JSON: {}", e);
                    Value::Null
                }
            }
        }
    }
}