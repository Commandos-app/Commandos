#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod logger;
mod open_cmd;


fn main() {
    logger::init_log();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![logger::logging, open_cmd::open_cmd])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
