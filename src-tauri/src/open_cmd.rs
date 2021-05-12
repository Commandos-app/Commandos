use std::process::Command;
// use std::str;

#[tauri::command]
pub fn open_cmd(path: String) {
    // println!("{}", path);

    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/c", "start", "cmd", "/k", "cd", &path])
            .spawn()
            .unwrap();
    } else {
        Command::new("sh").arg(&path).spawn().unwrap();
    };


}
