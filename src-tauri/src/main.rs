#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod logger;
mod open_cmd;
// mod system_tray;

fn main() {
  logger::init_log();
  //   let tray = ;

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      logger::logging,
      open_cmd::open_cmd
    ])
    //  .system_tray(system_tray::create_tray())
    // .on_system_tray_event(|app, event| match event {})
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
