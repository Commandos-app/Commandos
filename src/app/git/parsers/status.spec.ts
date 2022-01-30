import { parseStatus } from './status';

describe('single File status', () => {
    test('should return empty parse', async () => {
        const gitStatus: any = { stdout: '', stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        expect(rtn.length).toBe(0);
    });

    test('should parse a new untracked file', async () => {
        const gitStatus: any = { stdout: `? new.md`, stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        const [file] = rtn;
        expect(rtn.length).toBe(1);
        expect(file.isUntracked).toBe(true);
        expect(file.isNew).toBe(false);
        expect(file.isStaged).toBe(false);
        expect(file.isModified).toBe(false);
        expect(file.filename).toBe('new.md');
        expect(file.path).toBe('new.md');
    });

    test('should parse a modified unstaged file', async () => {
        const gitStatus: any = {
            stdout: `1 .M N... 100644 100644 100644 04e15462f2997620d1d6df5b43440b5482624b31 04e15462f2997620d1d6df5b43440b5482624b31 readme.md`,
            stderr: '',
            exitCode: 0,
        };

        const rtn = await parseStatus(gitStatus);
        const [file] = rtn;
        expect(rtn.length).toBe(1);
        expect(file.isUntracked).toBe(false);
        expect(file.isNew).toBe(false);
        expect(file.isStaged).toBe(false);
        expect(file.isModified).toBe(true);
        expect(file.filename).toBe('readme.md');
        expect(file.path).toBe('readme.md');
    });

    test('should parse a new staged file', async () => {
        const gitStatus: any = {
            stdout: `1 A. N... 000000 100644 100644 0000000000000000000000000000000000000000 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 folder1/folder2/testnewtest.md`,
            stderr: '',
            exitCode: 0,
        };

        const rtn = await parseStatus(gitStatus);
        const [file] = rtn;
        expect(rtn.length).toBe(1);
        expect(file.isUntracked).toBe(false);
        expect(file.isNew).toBe(true);
        expect(file.isStaged).toBe(true);
        expect(file.isModified).toBe(false);
        expect(file.filename).toBe('folder1/folder2/testnewtest.md');
        expect(file.path).toBe('folder1/folder2/testnewtest.md');
    });

    test('should parse a renamed file', async () => {
        const data = [
            '2 R. N... 100644 100644 100644 fafc03149a548de1546c6ed53e42d54960872fa3 445f4f17ef620b18c9376e268a0fe9880dd3245e R78 second-file.md',
            'secondfile.md',
        ];
        const gitStatus: any = { stdout: data.join('\0'), stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        const [file] = rtn;
        expect(rtn.length).toBe(1);
        expect(file.isUntracked).toBe(false);
        expect(file.isNew).toBe(false);
        expect(file.isStaged).toBe(true);
        expect(file.isModified).toBe(false);
        expect(file.isRenamed).toBe(true);
        expect(file.filename).toBe('second-file.md');
        expect(file.path).toBe('second-file.md');
        expect(file.oldPath).toBe('secondfile.md');
    });
});

describe('multiple files', () => {
    test('should parse 2 untracked files ', async () => {
        const gitStatus: any = { stdout: `? folder1/folder2/testnewtest.md\0? tetset.md`, stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        const [file1, file2] = rtn;
        expect(rtn.length).toBe(2);
        expect(file1.isUntracked).toBe(true);
        expect(file1.isNew).toBe(false);
        expect(file1.isStaged).toBe(false);
        expect(file1.isModified).toBe(false);
        expect(file1.filename).toBe('folder1/folder2/testnewtest.md');
        expect(file1.path).toBe('folder1/folder2/testnewtest.md');
        expect(file2.isUntracked).toBe(true);
        expect(file2.isNew).toBe(false);
        expect(file2.isStaged).toBe(false);
        expect(file2.isModified).toBe(false);
        expect(file2.filename).toBe('tetset.md');
        expect(file2.path).toBe('tetset.md');
    });

    test('should parse 2 files (modified,untracked)', async () => {
        const gitStatus: any = {
            stdout: `1 .M N... 100644 100644 100644 fafc03149a548de1546c6ed53e42d54960872fa3 fafc03149a548de1546c6ed53e42d54960872fa3 secondfile.md\0? folder1/folder2/testnewtest.md`,
            stderr: '',
            exitCode: 0,
        };

        const rtn = await parseStatus(gitStatus);
        const [file1, file2] = rtn;
        expect(rtn.length).toBe(2);
        expect(file1.isUntracked).toBe(false);
        expect(file1.isNew).toBe(false);
        expect(file1.isStaged).toBe(false);
        expect(file1.isModified).toBe(true);
        expect(file1.filename).toBe('secondfile.md');
        expect(file1.path).toBe('secondfile.md');
        expect(file2.isUntracked).toBe(true);
        expect(file2.isNew).toBe(false);
        expect(file2.isStaged).toBe(false);
        expect(file2.isModified).toBe(false);
        expect(file2.filename).toBe('folder1/folder2/testnewtest.md');
        expect(file2.path).toBe('folder1/folder2/testnewtest.md');
    });

    test('should parse 2 staged files (modified, added) ', async () => {
        const data = [
            '1 M. N... 100644 100644 100644 fafc03149a548de1546c6ed53e42d54960872fa3 445f4f17ef620b18c9376e268a0fe9880dd3245e secondfile.md',
            '1 A. N... 000000 100644 100644 0000000000000000000000000000000000000000 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 folder1/folder2/testnewtest.md',
        ];
        const gitStatus: any = { stdout: data.join('\0'), stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        const [file1, file2] = rtn;
        expect(rtn.length).toBe(2);
        expect(file1.isUntracked).toBe(false);
        expect(file1.isNew).toBe(false);
        expect(file1.isStaged).toBe(true);
        expect(file1.isModified).toBe(true);
        expect(file1.filename).toBe('secondfile.md');
        expect(file1.path).toBe('secondfile.md');
        expect(file2.isUntracked).toBe(false);
        expect(file2.isNew).toBe(true);
        expect(file2.isStaged).toBe(true);
        expect(file2.isModified).toBe(false);
        expect(file2.filename).toBe('folder1/folder2/testnewtest.md');
        expect(file2.path).toBe('folder1/folder2/testnewtest.md');
    });

    test('should parse 2 staged files (added, renamed) ', async () => {
        const data = [
            '1 A. N... 000000 100644 100644 0000000000000000000000000000000000000000 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 folder1/folder2/testnewtest.md',
            '2 R. N... 100644 100644 100644 fafc03149a548de1546c6ed53e42d54960872fa3 445f4f17ef620b18c9376e268a0fe9880dd3245e R78 second-file.md',
            'secondfile.md',
        ];
        const gitStatus: any = { stdout: data.join('\0'), stderr: '', exitCode: 0 };

        const rtn = await parseStatus(gitStatus);
        const [file1, file2] = rtn;
        expect(rtn.length).toBe(2);
        expect(file1.isUntracked).toBe(false);
        expect(file1.isNew).toBe(true);
        expect(file1.isStaged).toBe(true);
        expect(file1.isModified).toBe(false);
        expect(file1.filename).toBe('folder1/folder2/testnewtest.md');
        expect(file1.path).toBe('folder1/folder2/testnewtest.md');
        expect(file2.isUntracked).toBe(false);
        expect(file2.isNew).toBe(false);
        expect(file2.isStaged).toBe(true);
        expect(file2.isModified).toBe(false);
        expect(file2.isRenamed).toBe(true);
        expect(file2.filename).toBe('second-file.md');
        expect(file2.path).toBe('second-file.md');
        expect(file2.oldPath).toBe('secondfile.md');
    });
});
