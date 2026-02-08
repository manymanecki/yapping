mod commands;
mod error;
mod types;

use commands::{
    environment::{list_environments, read_environment},
    http::execute_request,
    workspace::{list_collections, open_workspace, read_request, save_request},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_workspace,
            list_collections,
            read_request,
            save_request,
            execute_request,
            list_environments,
            read_environment,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
