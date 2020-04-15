import { useLayoutEffect, useState } from "react";
import { debounce } from "../helpers";
export function useWindowSize() {
    const [state, setState] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useLayoutEffect(() => {
        const onresize = debounce(() => setState({ width: window.innerWidth, height: window.innerHeight }));
        window.addEventListener("resize", onresize);
        return () => window.removeEventListener("resize", onresize);
    }, []);
    return state;
}
export function useElementSize(ref) {
    const [state, setState] = useState(null);
    useLayoutEffect(() => {
        if (ref.current && window["ResizeObserver"]) {
            const observer = (entries, _observer) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    setState({ width, height });
                }
            };
            const ro = new ResizeObserver(observer);
            ro.observe(ref.current);
            return () => ro.unobserve(ref.current);
        }
    }, [ref]);
    return state;
}
