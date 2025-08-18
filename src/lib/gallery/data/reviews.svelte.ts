import { browser } from "$app/environment";
import { Bearror, get_data_release, LogLvl, type Review } from "libbearo";
import { sort_reviews } from "libbearo/src/utils/arr";

export function data() {
    let reviews: Review[] = $state([]);
    let is_loading = $state(false);
    let fetch_err: string | null = $state(null);
    let dl_progress = $state(0);

    async function load() {
        try {
            is_loading = true;
            dl_progress = 10;

            const file_contents = await get_data_release("reviews");
            dl_progress = 60;
            let data: Review[] = JSON.parse(await file_contents.text());
            data = sort_reviews(data);
            reviews = data;
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
        reviews: () => reviews,
        is_loading: () => is_loading,
        fetch_err: () => fetch_err,
        dl_progress: () => dl_progress,
    };
}