import * as commandExists from "command-exists";
import { existsSync } from "fs";

export function getOpenVpnBin(): string {
    switch (process.platform) {
        case "win32":
            if (existsSync("C:\\Program Files\\OpenVPN\\bin\\openvpn.exe")) {
                return "C:\\Program Files\\OpenVPN\\bin\\openvpn.exe";
            } else if (
                existsSync("C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe")
            ) {
                return "C:\\Program Files (x86)\\OpenVPN\\bin\\openvpn.exe";
            } else {
                throw new Error("OpenVPN binary not found.");
            }
        default:
            if (commandExists.sync("openvpn")) return "openvpn";
            else throw new Error("OpenVPN binary not found.");
    }
}
