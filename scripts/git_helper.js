import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const runCommand = (command) => {
    try {
        console.log(`Executing: ${command}`);
        return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.stderr || error.message);
        return null;
    }
};

export const microCommit = (message) => {
    runCommand('git add .');
    runCommand(`git commit -m "${message}"`);
};

export const createBranch = (branchName) => {
    runCommand(`git checkout -b ${branchName}`);
};

export const mergeToMain = (branchName) => {
    runCommand('git checkout main');
    runCommand(`git merge ${branchName} --no-ff -m "Merge branch '${branchName}'"`);
};

export const createPR = (branchName, title, body) => {
    // Using GitHub CLI if available, otherwise just logging
    try {
        runCommand(`gh pr create --title "${title}" --body "${body}" --base main --head ${branchName}`);
        runCommand(`gh pr merge ${branchName} --merge --delete-branch`);
    } catch (e) {
        console.log("GitHub CLI not configured or failed, falling back to local merge");
        mergeToMain(branchName);
    }
};

export const quickTask = (branchName, taskName, filesToModify, commitMessages) => {
    createBranch(branchName);
    // Implementation details would go here
    // For now this is a template
};
