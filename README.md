# DOS-Commander

## Debug
- App: `ng serve`
- Tauri: yarn tauri dev

## build tauri dev branch
`powershell -ExecutionPolicy Bypass -File .\.scripts\setup.ps1`  
or  
    `git pull && cd ./api && yarn && yarn build && cd ../tauri/cli/tauri.js && yarn && yarn build
    yarn add ../tauri/api --save`
