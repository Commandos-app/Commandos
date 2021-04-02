

import { open } from '@tauri-apps/api/dialog';
import { basename, harmonize } from '.';

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

