/// <reference types="react" />
declare type number_or_string = number | string;
declare type Size = {
    width: number_or_string;
    height: number_or_string;
};
export declare function useWindowSize(): Size;
export declare function useElementSize(ref: React.RefObject<HTMLDivElement>): Size | null;
export {};
