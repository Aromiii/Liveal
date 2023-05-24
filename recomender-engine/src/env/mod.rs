#[derive(Debug, Clone)]
pub(crate) struct Config {
    pub(crate) db_url: String,
    pub(crate) auth_url: String,
    // Add more fields as needed
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        dotenv::dotenv().ok();

        let db_url = std::env::var("DATABASE_URL").map_err(|_| "DB_URL not set")?;
        let auth_url = std::env::var("AUTH_URL").map_err(|_| "API_KEY not set")?;

        Ok(Config { db_url, auth_url })
    }
}