use serde::ser::{Serialize, SerializeStruct, Serializer};
use std::process::{Command, Stdio};

// Custom type for git commands.
pub struct GitResult {
  stdout: String,
  stderr: String,
}

// Custom serializer for the `GitResult` struct.
impl Serialize for GitResult {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    // 2 is the number of fields in the struct.
    let mut state = serializer.serialize_struct("GitResult", 2)?;
    // serialize the fields.
    state.serialize_field("stdout", &self.stdout)?;
    state.serialize_field("stderr", &self.stderr)?;
    state.end()
  }
}

// Git command.
#[tauri::command]
pub fn git(args: Vec<String>) -> GitResult {
  let output = Command::new("git")
    .args(args)
    .stdout(Stdio::piped())
    .output()
    .expect("failed to execute process");

  let stdout = String::from_utf8(output.stdout).unwrap();
  let stderr = String::from_utf8(output.stderr).unwrap();

  let result = GitResult { stdout, stderr };
  return result;
}
