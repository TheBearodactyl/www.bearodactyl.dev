import type { RouteItemNext } from "$lib/types";
import { choose_rand } from "$lib/utils/rand";

export const routes: RouteItemNext[] = [
    {
        path: "/",
        nameKey: "titles.routes.home",
        homePage: false,
    },
    {
        path: "/lists",
        nameKey: "titles.lists",
        description: "A list of lists!",
        coverImage: "/images/epicsauce.gif",
        homePage: false,
        children: [
            {
                path: "/lists/games",
                nameKey: "titles.routes.games",
                coverImage: "/videos/gamer.webm",
                homePage: true,
            },
            {
                path: "/lists/read-watch",
                nameKey: "titles.routes.read-watch",
                coverImage: "/images/hobo.gif",
                homePage: true,
            },
            {
                path: "/lists/projects",
                nameKey: "titles.routes.projects",
                coverImage: "/images/family-guy-css.gif",
                homePage: true,
            },
            {
                path: "/lists/one-piece",
                nameKey: "titles.routes.one-piece",
                coverImage: "/images/op.gif",
                homePage: true,
            },
            {
                path: "/lists/domains",
                nameKey: "titles.routes.domains",
                coverImage: "/images/domain-expansion.gif",
                homePage: true,
            },
            {
                path: "/lists/wplace-findings",
                nameKey: "titles.routes.wplace",
                coverImage: "https://files.catbox.moe/87q1sc.png",
                homePage: true,
            },
        ],
    },
    {
        path: "/jokes",
        nameKey: "titles.jokes",
        homePage: false,
        children: [
            {
                path: "/jokes/bearo",
                nameKey: "titles.routes.bearodactyl",
                coverImage: "/images/bearo.gif",
                homePage: true,
            },
            {
                path: "/jokes/woah",
                nameKey: "titles.routes.woah",
                coverImage: "/images/wulzy.gif",
                homePage: true,
            },
        ],
    },
    {
        path: "/license",
        nameKey: "titles.routes.license",
        coverImage: "/images/morshu.gif",
        homePage: true,
    },
    {
        path: "/priscilla",
        nameKey: "titles.routes.priscilla",
        coverImage: "/images/priscilla/PXL_20250809_135841557.jpg",
        homePage: true,
    },
    {
        path: "https://github.com/thebearodactyl/www.bearodactyl.dev",
        nameKey: "titles.routes.website-src",
        coverImage: "/videos/hackermans.webm",
        homePage: true,
    },

    // Image Cards for the homepage
    {
        path: "",
        nameKey: "",
        coverImage: "/images/mlg.gif",
        discouraged: true,
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://media.istockphoto.com/id/1298255522/photo/funny-african-man-posing-pointing-fingers-at-camera-yellow-background.jpg?s=612x612&w=0&k=20&c=1dcyemROSTy_V05a8ELTZA5HLCNSSwO4qwkdP2Dj4sU=",
        audioSrc: "https://www.myinstants.com/media/sounds/celebrate-good-times-mp3cut.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://archive.org/download/Chinese_Assassin_-_Dont_Mess_With_My_Dawgs_Mix_CD_-_PHZ/00cover.jpg",
        audioSrc: "https://www.myinstants.com/media/sounds/bad-to-the-bone.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://media.tenor.com/yWEFfnbrffIAAAAM/america-cancel-america.gif",
        audioSrc: "/audio/deathtoamerica.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://media.tenor.com/1q2EtzejgWUAAAAM/sakugastudio-jxrdn-absolute-cinema-luffy.gif",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "/images/idle.gif",
        audioSrc: choose_rand(["/audio/reactbot/ooowaaa.mp3", "/audio/reactbot/911.mp3"]),
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://i.ytimg.com/vi/yK1JRtoBY3Y/maxresdefault.jpg",
        audioSrc: "https://www.myinstants.com/media/sounds/export_ofoct_umPo7al.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://preview.redd.it/x3p9iu96h4t61.jpg?auto=webp&s=614dc3f1684512c99037bbda2099d058a4ad84f6",
        audioSrc: "/audio/gregnant.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://external-preview.redd.it/Q3ugnULDJtEfCySEG0treuKldm_Vb__snkvf5-TyhD4.jpg?width=1080&crop=smart&auto=webp&s=7579fe1c67e632d719a4b5ddbbf748e8c7c9e7af",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://preview.redd.it/k3lrzdqenioe1.png?width=640&crop=smart&auto=webp&s=176371447cd4401c15cd0d0eb70fbd571e054f63",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://comiczombie.net/wp-content/uploads/2021/05/getittogether.jpg",
        audioSrc: "/audio/scottpilgrim.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://carnivorouslreviews.wordpress.com/wp-content/uploads/2018/05/images231.jpg",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://i.ebayimg.com/images/g/Q6cAAOSwrT1gxlFX/s-l1200.jpg",
        audioSrc: "/audio/buggy.mp3",
    },
    {
        path: "",
        nameKey: "",
        coverImage:
            "https://lastfm.freetls.fastly.net/i/u/ar0/9392d450bc1b42b3847fd84f03c92c11.jpg",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://st.cdjapan.co.jp/pictures/l/00/29/AVCA-29411.jpg",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://st.cdjapan.co.jp/pictures/l/00/44/AVCA-29490.jpg",
    },
    {
        coverImage: "https://bokuben-anime.com/assets/img/story/02/01.jpg",
        path: "",
        nameKey: "",
    },
    {
        coverImage: "https://m.media-amazon.com/images/I/61ofSsK4fHL._UF894,1000_QL80_.jpg",
        path: "",
        nameKey: "",
    },
    {
        coverImage:
            "https://w0.peakpx.com/wallpaper/924/111/HD-wallpaper-anime-we-never-learn-asumi-kominami-fumino-furuhashi-mafuyu-kirisu-nariyuki-yuiga-rizu-ogata-uruka-takemoto.jpg",
        path: "",
        nameKey: "",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://pbs.twimg.com/media/Gh2LcZnbsAAd1PF?format=jpg&name=small",
    },
    {
        path: "",
        nameKey: "",
        coverImage: "https://pbs.twimg.com/media/GNPOIK3acAELa9p?format=jpg&name=360x360",
    },
    {
        nameKey: "",
        coverImage:
            "https://api.geode-sdk.org/v1/mods/the_bearodactyl.gay-wave-trail/logo?version=4.2.2",
        path: "https://geode-sdk.org/mods/the_bearodactyl.gay-wave-trail",
    },
];

// Helper functions to filter routes for different purposes
export function getMenuRoutes(): RouteItemNext[] {
    return routes.filter((route) => route.path && route.nameKey);
}

export function getGalleryRoutes(): RouteItemNext[] {
    return flattenRoutes(routes).filter((route) => route.homePage !== false);
}

export function flattenRoutes(routeList: RouteItemNext[]): RouteItemNext[] {
    const flattened: RouteItemNext[] = [];

    function flatten(items: RouteItemNext[]) {
        for (const item of items) {
            flattened.push(item);
            if (item.children) {
                flatten(item.children);
            }
        }
    }

    flatten(routeList);
    return flattened;
}
