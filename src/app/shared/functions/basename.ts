export function basename(path: string) {
    return path.substring(path.lastIndexOf('/') + 1);
}
