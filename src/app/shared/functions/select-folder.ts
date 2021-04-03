import { harmonize } from './harmonize-path';
import { basename } from './basename';
import { open } from '@tauri-apps/api/dialog';

export async function selectFolder() {
    const filePath: string = await open({ directory: true }) as string;
    if (filePath) {
        const path = harmonize(filePath);
        const name = basename(path);

        return {
            name,
            path
        }
    }
    return null;
}

