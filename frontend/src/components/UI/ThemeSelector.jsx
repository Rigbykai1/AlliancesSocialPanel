import { useEffect, useState } from "react";
import { PiPaintBrushBroad } from "react-icons/pi";

export const ThemeSelector = () => {
    const [currentTheme, setCurrentTheme] = useState("light")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light"
        document.documentElement.setAttribute("data-theme", savedTheme)
        setCurrentTheme(savedTheme)
    }, [])

    const handleThemeChange = (theme) => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
        setCurrentTheme(theme)
    }

    const themes = [
        "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine",
        "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
        "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
        "caramellatte", "abyss", "silk"
    ]

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline">
                <PiPaintBrushBroad />
            </div>
            <ul tabIndex={-1} className="dropdown-content bg-base-200 rounded-box z-1 w-32 mt-6 p-2 shadow-2xl max-h-96 overflow-y-auto outline">
                {themes.map(theme => (
                    <li key={theme}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start my-1"
                            aria-label={theme}
                            value={theme}
                            checked={currentTheme === theme}
                            onChange={() => handleThemeChange(theme)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
