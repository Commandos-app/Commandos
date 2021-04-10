#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod logger;

use crate::logger::{init_log, logging_wrapper};

fn main() {
  init_log();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![logging])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
