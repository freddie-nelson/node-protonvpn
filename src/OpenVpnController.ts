import { existsSync, lstatSync } from "fs";
import { getOpenVpnBin } from "./helpers/getOpenVpnBin";
import { spawn } from "child_process";

export interface OpenVpnAuth {
    user: string;
    pass: string;
}

export default class OpenVpnController {
    private openVpnBin: string;
    private openVpnProcess: ReturnType<typeof spawn> | null = null;
    private openVpnLog: string[] = [];
    private config: string;

    private status: "connected" | "connecting" | "disconnected" =
        "disconnected";

    private enabledLogging: boolean;

    constructor(openVpnBin?: string, enableLogging = false) {
        this.openVpnBin = openVpnBin ?? getOpenVpnBin();
        this.enabledLogging = enableLogging;
    }

    /**
     * Connects to the VPN using the specified config file.
     *
     * @param configPath Full path to the .ovpn config file.
     */
    connect(configPath: string, auth?: OpenVpnAuth) {
        if (!existsSync(configPath)) throw new Error("Config file not found.");

        if (lstatSync(configPath).isDirectory())
            throw new Error("Config file cannot be a directory.");

        if (!configPath.endsWith(".ovpn"))
            throw new Error("Config file must be an .ovpn file.");

        if (this.openVpnProcess) throw new Error("Already connected.");

        this.config = configPath;
        this.openVpnProcess = spawn(this.openVpnBin, ["--config", configPath]);

        this.status = "connecting";

        return new Promise<void>((resolve, reject) => {
            let skipPostAuthError = false;

            this.openVpnProcess.stderr.on("data", (err) => {
                const s = new String(err.toString());

                // handle auth
                // for some reason, the auth prompt is sent to stderr
                if (s.includes("Enter Auth Username:")) {
                    if (!auth)
                        throw new Error("Auth required but not provided.");

                    if (this.enabledLogging)
                        console.log("Enter Auth Username: " + auth.user);

                    this.openVpnProcess.stdin.write(`${auth.user}\n`);
                    return;
                } else if (s.includes("Enter Auth Password:")) {
                    if (!auth)
                        throw new Error("Auth required but not provided.");

                    if (this.enabledLogging)
                        console.log(
                            "Enter Auth Password: " +
                                auth.pass.replace(/./g, "*"),
                        );

                    this.openVpnProcess.stdin.write(`${auth.pass}\n`);
                    skipPostAuthError = true;
                    return;
                } else if (skipPostAuthError) {
                    // skip the error that occurs after auth
                    // this error consists of purely whitespace
                    // so only skip if the string is empty after trimming
                    skipPostAuthError = false;
                    if (s.trim() === "") return;
                }

                console.error("Error: ", s);
                this.disconnect();

                reject(s);
            });

            this.openVpnProcess.on("exit", (code, signal) => {
                const errorMsg = `OpenVPN process exited with code ${code} and signal ${signal} before connection could be established.`;
                console.error(errorMsg);
                this.disconnect();

                reject(new Error(errorMsg));
            });

            this.openVpnProcess.stdout.on("data", (msg) => {
                const msgStr = msg.toString();
                this.openVpnLog.push(msgStr);

                if (this.enabledLogging) console.log(msgStr);

                if (
                    msgStr
                        .toLowerCase()
                        .includes("initialization sequence completed")
                ) {
                    this.status = "connected";
                    resolve();
                }
            });
        });
    }

    /**
     * Disconnects from the VPN.
     */
    disconnect() {
        if (this.openVpnProcess) {
            const killed = this.openVpnProcess.kill();
            if (!killed) throw new Error("Failed to kill OpenVPN process.");

            this.openVpnProcess = null;

            this.config = "";
            this.status = "disconnected";
        } else {
            throw new Error("Not connected.");
        }
    }

    /**
     * Gets the log of the OpenVPN process.
     *
     * @returns A copy of the log.
     */
    getLog() {
        return [...this.openVpnLog];
    }

    /**
     * Clears the currently stored log.
     */
    clearLog() {
        this.openVpnLog = [];
    }

    /**
     * Gets the path to the config being used.
     *
     * @returns The path to the config being used.
     */
    getConfig() {
        return this.config;
    }

    /**
     * Gets the controller's current status.
     *
     * @returns The controller's current status.
     */
    getStatus() {
        return this.status;
    }
}
