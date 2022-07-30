#! /usr/bin/env node

// @ts-ignore

import yargs from 'yargs/yargs';
import process from "process";
import { exec } from "child_process";
import { rm } from 'fs/promises';
import path from 'path';

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
    .help("help")
    .argv;

const tmpl = argv.template;
const dir = argv.dir || tmpl;

exec(
    "git clone https://github.com/pxe-templates/" 
    + tmpl + ".git "
    + dir,
    () => {
        rm(path.join(dir, ".git"), { recursive: true });
        rm(path.join(dir, ".gitignore"));
    }
);