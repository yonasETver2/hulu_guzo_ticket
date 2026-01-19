import { useEffect } from "react";

export function useTheme(status) {
  useEffect(() => {
    if (status.setting.theme) {
        let root = window.document.documentElement;
        if (status.setting.theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else if (status.setting.theme === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
        }
    }
  }, [status.setting.theme]);
}
