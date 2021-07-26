import { runGit } from './base';

// Runs Cherry-pick command on git repository
export async function cherryPick(repository: string, sha: string): Promise<void> {
    const args = ['cherry-pick', sha];

    return runGit(args, repository, 'cherry-pick');
}

