use crate::error::AppError;
use crate::types::{Collection, RequestFile, Workspace};

#[tauri::command]
pub async fn open_workspace(path: String) -> Result<Workspace, AppError> {
    let workspace_path = std::path::Path::new(&path);

    if !workspace_path.is_dir() {
        return Err(AppError::NotFound(format!(
            "Directory not found: {}",
            path
        )));
    }

    let name = workspace_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("workspace")
        .to_string();

    Ok(Workspace {
        path,
        name,
        collections: Vec::new(),
    })
}

#[tauri::command]
pub async fn list_collections(workspace_path: String) -> Result<Vec<Collection>, AppError> {
    let _ = workspace_path;
    Ok(Vec::new())
}

#[tauri::command]
pub async fn read_request(path: String) -> Result<RequestFile, AppError> {
    let content = std::fs::read_to_string(&path)?;
    let request: RequestFile = serde_json::from_str(&content)?;
    Ok(request)
}

#[tauri::command]
pub async fn save_request(path: String, request: RequestFile) -> Result<(), AppError> {
    let content = serde_json::to_string_pretty(&request)?;
    std::fs::write(&path, content)?;
    Ok(())
}
