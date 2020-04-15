import React from "react";
export function View(props) {
    const { children, style, ...other } = props;
    return (React.createElement("div", Object.assign({ style: {
            alignItems: "stretch",
            borderWidth: 0,
            borderStyle: "solid",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            margin: 0,
            minHeight: 0,
            minWidth: 0,
            padding: 0,
            position: "relative",
            zIndex: 0,
            ...style
        } }, other), children));
}
