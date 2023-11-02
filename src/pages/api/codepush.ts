import { NextApiRequest, NextApiResponse } from "next";
const { Octokit } = require("@octokit/rest");
const owner = process.env.owner;
const repo = process.env.repo;
const token = process.env.token;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        const octokit = new Octokit({ auth: `token ${token}` });

        // 1. Create a Blob
        const blob = await octokit.git.createBlob({
            owner,
            repo,
            content: `Adding Code on ${new Date().toString()}`,
            encoding: 'utf-8',
        });

        // 2. Get the Reference
        const ref = await octokit.git.getRef({
            owner,
            repo,
            ref: 'heads/main',
        });


        // 3. Get the Commit
        const commit = await octokit.git.getCommit({
            owner,
            repo,
            commit_sha: ref.data.object.sha,
        });

        // 4. Create a Tree
        const tree = await octokit.git.createTree({
            owner,
            repo,
            base_tree: commit.data.tree.sha,
            tree: [
            {
                path: 'file.txt',
                mode: '100644',
                type: 'blob',
                sha: blob.data.sha,
            },
            ],
        });

        // 5. Create a Commit
        const newCommit = await octokit.git.createCommit({
            owner,
            repo,
            message: 'Add file.txt',
            tree: tree.data.sha,
            parents: [commit.data.sha],
        });

        // 6. Update the Reference
        await octokit.git.updateRef({
            owner,
            repo,
            ref: 'heads/main',
            sha: newCommit.data.sha,
        });
        res.status(200).json({message: "Success", data: {}})
        break;
      case "POST":
        res.status(400).json({message: "No Such method!", data: {}})
        break;
    }
}