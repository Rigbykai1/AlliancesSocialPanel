import { PiSidebarLight } from "react-icons/pi";
import NotificationBell from "./NotificationBell";
import { ThemeSelector } from "./ThemeSelector";

const NavBar = ({ setView }) => {
    return (
        <nav className="navbar fixed top-4 left-1/2 -translate-x-1/2 
                bg-base-200 rounded-box shadow-lg px-3 z-50 w-[calc(100%-1rem)]">
            <div className="navbar-start">
                <label
                    htmlFor="my-drawer-4"
                    aria-label="open sidebar"
                    className="btn btn-outline"
                >
                    <PiSidebarLight className='size-6' />
                </label>
            </div>

            <div className="navbar-center">
                <div className="btn btn-ghost font-bold text-lg" onClick={() => setView('list')}>
                    Panel
                </div>
            </div>

            <div className="navbar-end gap-2">

                {/* 🔔 Notificaciones */}
                <NotificationBell />

                {/* 🎨 Selector de tema */}
                <ThemeSelector />

            </div>
        </nav>
    )
}

export default NavBar
