#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod logger;

use crate::logger::{logging_wrapper, init_log};

fn main() {
  init_log();

  tauri::AppBuilder::default()
    .invoke_handler(tauri::generate_handler![logging])
    .build(tauri::generate_context!())
    .run();
}
