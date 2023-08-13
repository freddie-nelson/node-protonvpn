import {
    existsSync,
    lstatSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from "fs";
import { resolve } from "path";

export function fixConfigCompressionError(configPath: string) {
    if (!existsSync(configPath)) throw new Error("Config file not found.");
    if (lstatSync(configPath).isDirectory())
        throw new Error("Config file cannot be a directory.");
    if (!configPath.endsWith(".ovpn"))
        throw new Error("Config file must be an .ovpn file.");

    let f = readFileSync(configPath, "utf-8");
    f = f.replace(
        "fast-io",
        `fast-io\n\n${!f.includes("comp-lzo") ? "comp-lzo yes" : ""}\n${
            !f.includes("allow-compression") ? "allow-compression yes" : ""
        }`,
    );

    if (!f.includes("block-outside-dns"))
        f = f.replace("fast-io", "fast-io\nblock-outside-dns");

    writeFileSync(configPath, f);
}

export function fixConfigCompressionErrorDir(dir: string) {
    if (!existsSync(dir)) throw new Error("Config directory not found.");
    if (!lstatSync(dir).isDirectory())
        throw new Error("Config directory must be a directory.");

    const files = readdirSync(dir);
    for (const file of files) {
        fixConfigCompressionError(resolve(dir, file));
    }
}
