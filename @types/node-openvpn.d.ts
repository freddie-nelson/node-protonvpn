declare module "node-openvpn" {
    export interface OpenvpnOptions {
        host?: string;
        port?: number;
        timeout?: number;
        logpath?: string;
    }

    export interface OpenvpnAuth {
        user: string;
        pass: string;
    }

    export interface Openvpn {
        on(event: "connected", callback: () => void): void;
        on(event: "disconnected", callback: () => void): void;
        on(event: "console-output", callback: (output: string) => void): void;
        on(event: "state-change", callback: (state: string[]) => void): void;
        on(event: "error", callback: (err: string) => void): void;
    }

    export default abstract class OpenvpnManager {
        static connect: (options: OpenvpnOptions) => Openvpn;
        static disconnect: () => void;
        static destroy: () => void;
        static authorize: (auth: OpenvpnAuth) => void;
        static getLog: (logger: typeof console.log) => void;
    }
}
