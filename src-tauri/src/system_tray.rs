// use tauri::Manager;
// use tauri::{
//   AppHandle, CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
// };

// pub fn create_tray() -> tauri::SystemTray<std::string::String> {
//   // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
//   let quit = CustomMenuItem::new("quit".to_string(), "Quit");
//   let hide = CustomMenuItem::new("hide".to_string(), "Hide");
//   let show = CustomMenuItem::new("show".to_string(), "Show");
//   let tray_menu = SystemTrayMenu::new()
//     .add_item(show)
//     .add_item(hide)
//     .add_native_item(SystemTrayMenuItem::Separator)
//     .add_item(quit);

//   SystemTray::new().with_menu(tray_menu)
// }

// pub fn tray_events(app: AppHandle, event: SystemTrayEvent<MenuId>) {
//   match event {
//     SystemTrayEvent::MenuItemClick { id, .. } => {
//       // get a handle to the clicked menu item
//       // note that `tray_handle` can be called anywhere,
//       // just get a `AppHandle` instance with `app.handle()` on the setup hook
//       // and move it to another function or thread
//       let item_handle = app.tray_handle().get_item(&id);
//       match id.as_str() {
//         "hide" => {
//           let window = app.get_window("main").unwrap();
//           window.hide().unwrap();
//           // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
//           //   item_handle.set_enabled(false).unwrap();
//         }
//         "show" => {
//           let window = app.get_window("main").unwrap();
//           window.show().unwrap();
//           //   let hide_item = app.tray_handle().get_item("hide");

//           //   window.focus().unwrap();
//           // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
//           //   item_handle.set_enabled(true).unwrap();
//         }

//         "quit" => {
//           let window = app.get_window("main").unwrap();
//           window.close().unwrap();
//         }
//         _ => {}
//       }
//     }
//     _ => {}
//   }
// }
