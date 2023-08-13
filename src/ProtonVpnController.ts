import { existsSync, lstatSync, readdirSync } from "fs";
import OpenVpnController, { OpenVpnAuth } from "./OpenVpnController";
import { CountryCode, countryCodes } from "./helpers/countryCode";
import { resolve } from "path";

export default class ProtonVpnController {
    private configDir: string;
    private configs = new Map<CountryCode, string>();

    private openVpnController: OpenVpnController;
    private auth: OpenVpnAuth;

    constructor(
        configDir: string,
        auth: OpenVpnAuth,
        openVpnOptions?: { openVpnBin?: string; enableLogging?: boolean },
    ) {
        this.configDir = this.validateConfigDir(configDir);
        this.configs = this.getCountryConfigs(configDir);

        this.auth = auth;
        this.openVpnController = new OpenVpnController(
            openVpnOptions?.openVpnBin,
            openVpnOptions?.enableLogging,
        );
    }

    connect(country: CountryCode | "random") {
        if (country === "random") {
            country =
                countryCodes[Math.floor(Math.random() * countryCodes.length)];
        }

        if (!this.configs.has(country)) throw new Error("Config not found.");

        return this.openVpnController.connect(
            this.configs.get(country)!,
            this.auth,
        );
    }

    disconnect() {
        return this.openVpnController.disconnect();
    }

    getStatus() {
        return this.openVpnController.getStatus();
    }

    private validateConfigDir(dir: string) {
        if (!existsSync(dir)) throw new Error("Config directory not found.");

        if (!lstatSync(dir).isDirectory())
            throw new Error("Config directory must be a directory.");

        const files = readdirSync(dir);
        if (files.length === 0) throw new Error("Config directory is empty.");

        for (const file of files) {
            if (!file.endsWith(".ovpn"))
                throw new Error("Config directory contains non .ovpn files.");
        }

        return dir;
    }

    private getCountryConfigs(dir: string): Map<CountryCode, string> {
        const configs = new Map<CountryCode, string>();

        const files = readdirSync(dir);

        countryCodes.forEach((countryCode) => {
            const config = files.find((f) =>
                f.startsWith(countryCode.toLowerCase()),
            );
            if (!config)
                throw new Error(`Config for ${countryCode} not found.`);

            configs.set(countryCode, resolve(dir, config));
        });

        return configs;
    }
}
