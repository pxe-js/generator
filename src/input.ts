import { stdin, stdout } from "process";
import { createInterface } from "readline";

export const rl = createInterface(stdin, stdout);

export async function getline(question: string) {
    return new Promise<string>(res => 
        rl.question(question, res)
    );
}