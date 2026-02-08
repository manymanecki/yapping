use crate::error::AppError;
use crate::types::Environment;

#[tauri::command]
pub async fn list_environments(workspace_path: String) -> Result<Vec<String>, AppError> {
    let env_dir = std::path::Path::new(&workspace_path).join("environments");

    if !env_dir.is_dir() {
        return Ok(Vec::new());
    }

    let mut names = Vec::new();
    let entries = std::fs::read_dir(&env_dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            if let Some(stem) = path.file_stem().and_then(|s| s.to_str()) {
                names.push(stem.to_string());
            }
        }
    }

    Ok(names)
}

#[tauri::command]
pub async fn read_environment(path: String) -> Result<Environment, AppError> {
    let content = std::fs::read_to_string(&path)?;
    let env: Environment = serde_json::from_str(&content)?;
    Ok(env)
}
