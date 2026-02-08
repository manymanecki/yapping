use crate::error::AppError;
use crate::types::{HttpRequest, HttpResponse};

#[tauri::command]
pub async fn execute_request(request: HttpRequest) -> Result<HttpResponse, AppError> {
    let _ = request;
    Err(AppError::InvalidRequest(
        "HTTP execution not yet implemented".to_string(),
    ))
}
