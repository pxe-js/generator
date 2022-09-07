#! /usr/bin/env node

import yargs from 'yargs';
import { exec } from "child_process";
import { rm } from 'fs/promises';
import path from 'path';
import { getline, rl } from './input';

// Args type
interface Args {
    [x: string]: unknown;
    template: string;
    dir: string;
    typescript: boolean;
    ts: boolean;
    _: (string | number)[];
    $0: string;
}

// Get args using yargs
const argv = yargs(process.argv.slice(2))
    .option("template", {
        alias: "t",
        describe: "Choose the template"
    })
    .option("dir", {
        alias: "d",
        describe: "Specify the directory to generate the project"
    })
    .boolean("typescript")
    .alias("ts", "typescript")
    .help("help")
    .argv as Args;

(async () => {
    // Parsing args and target template
    let tmpl = argv.template;
    let dir = argv.dir || tmpl;
    let isTs = argv.typescript;

    if (!tmpl) {
        tmpl = await getline("Enter the template name (default): ");
        rl.close();

        if (!tmpl)
            tmpl = "default";
    }

    if (!dir)
        dir = tmpl;

    const targetTemplate = "https://github.com/pxe-templates/"
        + tmpl
        + (isTs ? "-ts" : "")
        + ".git";

    console.log("Using", targetTemplate);

    // Handle exception
    process.on("uncaughtException", e => {
        if (e) {
            console.error(e);
            process.exit(1);
        }
    })

    // Clone the repo from Github
    exec("git clone " + targetTemplate + " " + dir, () => {
        rm(path.join(dir, ".git"), { recursive: true });
        rm(path.join(dir, ".gitignore"));
    });
})()