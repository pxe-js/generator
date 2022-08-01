#! /usr/bin/env node

// @ts-ignore

import yargs from 'yargs';
import process, { exit } from "process";
import { exec } from "child_process";
import { rm } from 'fs';
import path from 'path';

interface Args {
    [x: string]: unknown;
    template: string;
    dir: string;
    typescript: boolean;
    ts: boolean;
    _: (string | number)[];
    $0: string;
}

const argv = yargs(process.argv.slice(2))
    .option("template", {
        alias: "t",
        describe: "Choose the template",
        default: "default"
    })
    .option("dir", {
        alias: "d",
        describe: "Specify the directory to generate the project"
    })
    .boolean("typescript")
    .alias("ts", "typescript")
    .help("help")
    .argv as Args;

const tmpl = argv.template;
const dir = argv.dir || tmpl;
const ts = argv.typescript ?? false;

const targetTemplate = "https://github.com/pxe-templates/"
    + tmpl
    + (ts ? "-ts" : "")
    + ".git";

console.log("Using", targetTemplate);

const handleError = (err: any) => {
    if (err) {
        console.error("Cannot find template", targetTemplate);
        exit(1);
    }
}

exec("git clone " + targetTemplate + " " + dir, () => {
    rm(path.join(dir, ".git"), { recursive: true }, handleError);
    rm(path.join(dir, ".gitignore"), handleError);
});