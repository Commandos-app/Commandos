export class LogItem {
    sha!: string;
    shortSha!: string;
    summary!: string;
    body!: string;
    author!: string;
    authorMail!: string;
    authorDate!: string;
    committer!: string;
    committerMail!: string;
    committerDate!: string;
    parents!: string;
    trailers!: string;
    refs!: string;
}


export const logFormaterObject = {
    sha: '%H', // SHA
    shortSha: '%h', // short SHA
    summary: '%s', // summary
    body: '%b', // body
    // author identity string, matching format of GIT_AUTHOR_IDENT.
    // author name <author email> <author date>
    // author date format dependent on --date arg, should be raw
    author: '%an',
    authorMail: '%ae',
    authorDate: '%ad',
    committer: '%cn',
    committerMail: '%ce',
    committerDate: '%cd',
    parents: '%P', // parent SHAs,
    trailers: '%(trailers:unfold,only)',
    refs: '%D',
}
