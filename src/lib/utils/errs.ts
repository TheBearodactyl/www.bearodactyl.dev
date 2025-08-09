import type { LogLvl } from "$lib/types";

export class Bearror {
    private lvl: LogLvl;
    private human_msg: string;
    private full_msg: string;

    constructor(lvl: LogLvl, human_msg: string) {
        this.lvl = lvl;
        this.human_msg = human_msg;
        this.full_msg = "";
    }

    set_full_msg(error: unknown): Bearror {
        if (error instanceof Error) {
            this.full_msg = `${error.name} - ${error.message}`;
        } else {
            this.full_msg = String(error);
        }

        return this;
    }

    to_string(): string {
        return `[${this.lvl}] - ${this.human_msg}:\n    ${this.full_msg}`;
    }
}
