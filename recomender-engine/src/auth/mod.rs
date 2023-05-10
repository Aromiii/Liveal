use rocket::http::Cookie;

async fn get_session(cookie: &Cookie<'_>) -> String {
    let url = "https://liveal.vercel.app/api/auth/session";

    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .header(reqwest::header::COOKIE, cookie.to_string())
        .send()
        .await
        .expect("failed to get response")
        .text()
        .await
        .expect("failed to get payload");

    return response;
}

pub async fn check(cookie: Option<&Cookie<'_>>) -> bool {
    return match cookie {
        None => { false }
        Some(cookie) => {
            let session = get_session(cookie).await;
            println!("{:#?}", session);
            if session == "{}" {
                return false
            }

            true
        }
    }
}