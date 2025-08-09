import { browser } from "$app/environment";
import { LogLvl, type Project } from "$lib/types";
import { Bearror } from "$lib/utils/errs";
import { get_gh_release } from "$lib/utils/net";
import { shuffle } from "$lib/utils/rand";

export function data() {
    let projects: Project[] = $state([]);
    let is_loading = $state(false);
    let fetch_err: string | null = $state(null);
    let dl_progress = $state(0);

    async function load() {
        try {
            is_loading = true;
            dl_progress = 10;

            const file_contents = await get_gh_release(
                "thebearodactyl",
                "www.bearodactyl.dev",
                "projects.json"
            )
            dl_progress = 60;
            let data: Project[] = JSON.parse(await file_contents.text());
            data = shuffle(data);
            projects = data;
            dl_progress = 100;
        } catch (err) {
            const error_msg = new Bearror(LogLvl.ERR, "Failed to load games list")
                .set_full_msg(err)
                .to_string();

            fetch_err = error_msg;
            console.error(error_msg);
        } finally {
            is_loading = false;
        }
    }

    $effect.pre(() => {
        if (browser) {
            load();
        }
    });

    return {
        projects: () => projects,
        is_loading: () => is_loading,
        fetch_err: () => fetch_err,
        dl_progress: () => dl_progress,
    };
}
