import React from "react";
export declare type ThemeContextValue = {
    uiBaseColor: string;
    uiDisabledColor: string;
    hoverredTabColor: string;
    draggingTabColor: string;
    draggingColor: string;
    overlayColor: string;
    unoverlayColor: string;
};
export declare const ThemeContext: React.Context<ThemeContextValue>;
export declare function useTheme(): ThemeContextValue;
