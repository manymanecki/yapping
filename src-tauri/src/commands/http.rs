use std::time::Instant;

use reqwest::header::{HeaderName, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use reqwest::multipart;
use reqwest::Method;

use crate::error::AppError;
use crate::types::{
    ApiKeyLocation, AuthConfig, HttpMethod, HttpRequest, HttpResponse, KeyValuePair, RequestBody,
};

fn to_reqwest_method(method: &HttpMethod) -> Method {
    match method {
        HttpMethod::Get => Method::GET,
        HttpMethod::Post => Method::POST,
        HttpMethod::Put => Method::PUT,
        HttpMethod::Patch => Method::PATCH,
        HttpMethod::Delete => Method::DELETE,
        HttpMethod::Head => Method::HEAD,
        HttpMethod::Options => Method::OPTIONS,
    }
}

#[tauri::command]
pub async fn execute_request(request: HttpRequest) -> Result<HttpResponse, AppError> {
    // Parse URL and append enabled query params
    let mut url = reqwest::Url::parse(&request.url)
        .map_err(|e| AppError::InvalidRequest(format!("Invalid URL: {e}")))?;

    {
        let mut query_pairs = url.query_pairs_mut();
        for param in request.params.iter().filter(|p| p.enabled) {
            query_pairs.append_pair(&param.key, &param.value);
        }
    }

    let client = reqwest::Client::new();
    let method = to_reqwest_method(&request.method);
    let mut builder = client.request(method, url);

    // Apply enabled headers
    for header in request.headers.iter().filter(|h| h.enabled) {
        let name = HeaderName::from_bytes(header.key.as_bytes())
            .map_err(|e| AppError::InvalidRequest(format!("Invalid header name '{}': {e}", header.key)))?;
        let value = HeaderValue::from_str(&header.value)
            .map_err(|e| AppError::InvalidRequest(format!("Invalid header value for '{}': {e}", header.key)))?;
        builder = builder.header(name, value);
    }

    // Apply auth
    match &request.auth {
        AuthConfig::None => {}
        AuthConfig::Bearer { token } => {
            builder = builder.header(AUTHORIZATION, format!("Bearer {token}"));
        }
        AuthConfig::Basic { username, password } => {
            builder = builder.basic_auth(username, Some(password));
        }
        AuthConfig::ApiKey { key, value, add_to } => match add_to {
            ApiKeyLocation::Header => {
                let name = HeaderName::from_bytes(key.as_bytes())
                    .map_err(|e| AppError::InvalidRequest(format!("Invalid API key header name: {e}")))?;
                let val = HeaderValue::from_str(value)
                    .map_err(|e| AppError::InvalidRequest(format!("Invalid API key header value: {e}")))?;
                builder = builder.header(name, val);
            }
            ApiKeyLocation::QueryParam => {
                builder = builder.query(&[(key, value)]);
            }
        },
    }

    // Apply body
    match &request.body {
        RequestBody::None => {}
        RequestBody::Json { content } => {
            builder = builder.header(CONTENT_TYPE, "application/json").body(content.clone());
        }
        RequestBody::FormData { fields } => {
            let mut form = multipart::Form::new();
            for field in fields.iter().filter(|f| f.enabled) {
                form = form.text(field.key.clone(), field.value.clone());
            }
            builder = builder.multipart(form);
        }
        RequestBody::UrlEncoded { fields } => {
            let form_data: Vec<(&str, &str)> = fields
                .iter()
                .filter(|f| f.enabled)
                .map(|f| (f.key.as_str(), f.value.as_str()))
                .collect();
            builder = builder.form(&form_data);
        }
    }

    // Send request and time it
    let start = Instant::now();
    let response = builder.send().await?;
    let elapsed = start.elapsed();

    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();

    let headers: Vec<KeyValuePair> = response
        .headers()
        .iter()
        .map(|(name, value)| KeyValuePair {
            key: name.to_string(),
            value: value.to_str().unwrap_or("<binary>").to_string(),
            enabled: true,
        })
        .collect();

    let body = response.text().await?;
    let size_bytes = body.len() as u64;
    let time_ms = elapsed.as_millis() as u64;

    Ok(HttpResponse {
        status,
        status_text,
        headers,
        body,
        time_ms,
        size_bytes,
    })
}
