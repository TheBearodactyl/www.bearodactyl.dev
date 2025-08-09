export type ProgressCallback = (progress: number) => void;

export interface BookFilters {
    title: string;
    author: string;
    genres: string[];
    tags: string[];
    rating: number | null;
    status: string;
}

export interface Book {
    id: string | number;
    title: string;
    author: string;
    genres: string[];
    tags: string[];
    rating: number;
    status: string;
    description: string;
    myThoughts: string;
    links?: { title: string; url: string }[];
    coverImage: string;
    explicit: boolean;
    color?: string;
}

export interface ReviewFilters {
    search: string;
    minRating?: number;
    maxRating?: number;
}

export interface Review {
    chapter: number;
    description: string;
    rating: number;
    thoughts?: string;
}

export interface Project {
    name: string;
    description: string;
    tags?: string[];
    source: string;
    coverImage?: string;
    installCommand?: string;
}

export interface Game {
    id: string | number;
    title: string;
    developer: string;
    genres: string[];
    tags: string[];
    rating: number;
    status: string;
    description: string;
    myThoughts: string;
    links?: { title: string; url: string }[];
    coverImage?: string;
    explicit: boolean;
    percent: number;
    bad: boolean;
}

export interface NavItem {
    name?: string;
    title?: string;
    description?: string;
    discouraged?: boolean;
    coverImage?: string;
    audioSrc?: string;
    route: string;
}

export interface RouteItem {
    path: string;
    nameKey: string;
    children?: RouteItem[];
}

export interface FunnyImg {
    alt: string,
    src: string
}

export interface DropdownItem {
    value: string;
    count?: number;
}

export interface RouteItem {
    path: string;
    nameKey: string;
    children?: RouteItem[];
}

export enum LogLvl {
    SUCCESS = "SUCCESS",
    INFO = "INFO",
    WARN = "WARN",
    ERR = "ERR",
    DEBUG = "DEBUG",
}