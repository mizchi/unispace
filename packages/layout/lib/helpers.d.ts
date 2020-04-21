export declare function interpose<T>(list: T[], interposer: (a: T, b: T, aIndex: number, bIndex: number) => T): T[];
export declare function pixelToNumber(expr: string | number): number;
export declare function fractionToNumber(expr: string | number): number;
export declare function numberToPixel(expr: number): string;
export declare function numberToFraction(expr: number): string;
export declare function exprsToPixels(exprs: string[], maxSize: number): string[];
export declare function pixelsToFractions(exprs: string[]): string[];
export declare function debounce(fn: Function, interval?: number): () => void;
