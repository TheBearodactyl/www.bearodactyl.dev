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
                coverImage: "https://i.ytimg.com/vi/LCQImL24Ato/maxresdefault.jpg",
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
        audioSrc: "/audio/cornered.mp3",
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
        audioSrc: "https://www.myinstants.com/media/sounds/lemon-demon-two-trucks-audiotrimmer.mp3",
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
    {
        nameKey: "",
        coverImage:
            "https://wallpapers.com/images/hd/vaporwave-art-doki-doki-literature-club-o00qnyt4zwlcpkhu.jpg",
        path: "",
    },
    {
        nameKey: "",
        coverImage:
            "https://preview.redd.it/b4iabc1b7xp11.png?auto=webp&s=ce04893199857d1d610a8c66eade52f64fc0439d",
        path: "",
    },
];

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRoutesByProperty(property: keyof RouteItemNext, value: any): RouteItemNext[] {
    const allRoutes = flattenRoutes(routes);
    return allRoutes.filter((route) => route[property] === value);
}

/**
 * Get direct children of a parent route by path
 * @param parentPath - The path of the parent route
 * @returns Array of direct child routes, or empty array if no children found
 */
export function getRouteChildren(parentPath: string): RouteItemNext[] {
    const parentRoute = findRouteByPath(parentPath);
    return parentRoute?.children || [];
}

/**
 * Get children of a parent route by nameKey
 * @param parentNameKey - The nameKey of the parent route
 * @returns Array of direct child routes, or empty array if no children found
 */
export function getRouteChildrenByNameKey(parentNameKey: string): RouteItemNext[] {
    const parentRoute = findRouteByNameKey(parentNameKey);
    return parentRoute?.children || [];
}

/**
 * Get all descendants (children, grandchildren, etc.) of a parent route
 * @param parentPath - The path of the parent route
 * @returns Array of all descendant routes (flattened)
 */
export function getAllRouteDescendants(parentPath: string): RouteItemNext[] {
    const parentRoute = findRouteByPath(parentPath);
    if (!parentRoute?.children) return [];

    return flattenRoutes(parentRoute.children);
}

/**
 * Get children of a parent route with optional filtering
 * @param parentPath - The path of the parent route
 * @param filterFn - Optional filter function to apply to children
 * @returns Array of filtered child routes
 */
export function getFilteredRouteChildren(
    parentPath: string,
    filterFn?: (route: RouteItemNext) => boolean,
): RouteItemNext[] {
    const children = getRouteChildren(parentPath);
    return filterFn ? children.filter(filterFn) : children;
}

/**
 * Get children that should be displayed on home page
 * @param parentPath - The path of the parent route
 * @returns Array of child routes where homePage !== false
 */
export function getHomePageRouteChildren(parentPath: string): RouteItemNext[] {
    return getFilteredRouteChildren(parentPath, (route) => route.homePage !== false);
}

/**
 * Get children with cover images (suitable for gallery display)
 * @param parentPath - The path of the parent route
 * @returns Array of child routes that have cover images
 */
export function getGalleryRouteChildren(parentPath: string): RouteItemNext[] {
    return getFilteredRouteChildren(parentPath, (route) => !!route.coverImage);
}

/**
 * Find a route by its path (searches all routes recursively)
 * @param path - The path to search for
 * @returns The found route or undefined
 */
export function findRouteByPath(path: string): RouteItemNext | undefined {
    function searchInRoutes(routeList: RouteItemNext[]): RouteItemNext | undefined {
        for (const route of routeList) {
            if (route.path === path) {
                return route;
            }
            if (route.children) {
                const found = searchInRoutes(route.children);
                if (found) return found;
            }
        }
        return undefined;
    }

    return searchInRoutes(routes);
}

/**
 * Find a route by its nameKey (searches all routes recursively)
 * @param nameKey - The nameKey to search for
 * @returns The found route or undefined
 */
export function findRouteByNameKey(nameKey: string): RouteItemNext | undefined {
    function searchInRoutes(routeList: RouteItemNext[]): RouteItemNext | undefined {
        for (const route of routeList) {
            if (route.nameKey === nameKey) {
                return route;
            }
            if (route.children) {
                const found = searchInRoutes(route.children);
                if (found) return found;
            }
        }
        return undefined;
    }

    return searchInRoutes(routes);
}

/**
 * Check if a route has children
 * @param path - The path of the route to check
 * @returns Boolean indicating if the route has children
 */
export function routeHasChildren(path: string): boolean {
    const route = findRouteByPath(path);
    return !!(route?.children && route.children.length > 0);
}

/**
 * Get the parent route of a given route
 * @param childPath - The path of the child route
 * @returns The parent route or undefined if no parent found
 */
export function getRouteParent(childPath: string): RouteItemNext | undefined {
    function searchForParent(
        routeList: RouteItemNext[],
        targetPath: string,
    ): RouteItemNext | undefined {
        for (const route of routeList) {
            if (route.children) {
                if (route.children.some((child) => child.path === targetPath)) {
                    return route;
                }
                const found = searchForParent(route.children, targetPath);
                if (found) return found;
            }
        }
        return undefined;
    }

    return searchForParent(routes, childPath);
}
