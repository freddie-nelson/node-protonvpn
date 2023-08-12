import eslint from "@rollup/plugin-eslint";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import ts from "rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";

/** @type {import('rollup').RollupOptions} */
const options = {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            sourcemap: true,
        },
        {
            file: "dist/index.min.js",
            format: "iife",
            name: "MyLib",
            plugins: [terser()],
            sourcemap: true,
        },
    ],
    plugins: [
        del({ targets: "dist/*" }),
        ts(),
        typescriptPaths(),
        json(),
        eslint(),
        resolve(),
    ],
};

export default options;
