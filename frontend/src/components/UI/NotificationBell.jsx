import { useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNotifications } from "../../hooks/useNotifications";
import { PiTrash } from "react-icons/pi";
import { PiX } from "react-icons/pi";

// ─── Severity config ─────────────────────────────────────────────────────────
const SEVERITY = {
    info: { badge: "badge-info", icon: "ℹ️", label: "Info" },
    success: { badge: "badge-success", icon: "✅", label: "Success" },
    warning: { badge: "badge-warning", icon: "⚠️", label: "Warning" },
    error: { badge: "badge-error", icon: "🔴", label: "Error" },
};

const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
};

// ─── Component ───────────────────────────────────────────────────────────────
const NotificationBell = () => {
    const { notifications, unreadCount, markRead, markAllRead, dismiss, clearAll } =
        useNotifications();

    // Close dropdown when clicking outside
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                dropdownRef.current.removeAttribute("open");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // const handleOpen = () => {
    // Mark all read when panel is opened
    //     if (unreadCount > 0) markAllRead();
    // };

    return (
        <details className="dropdown dropdown-end" ref={dropdownRef} >
            <summary className="btn btn-outline relative list-none">
                <IoNotificationsOutline className="size-5" />
                {unreadCount > 0 && (
                    <span className="badge badge-error text-neutral-content badge-md absolute -top-2 -right-2 px-2 text-[0.6rem] animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </summary>

            <div className="dropdown-content bg-base-200 rounded-box shadow-lg z-50 w-80 mt-6 outline">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                    <span className="flex flex-row font-semibold text-sm">
                        Notificaciones
                        {notifications.length > 0 && (
                            <span className="ml-2 badge badge-neutral badge-sm">
                                {notifications.length}
                            </span>
                        )}
                    </span>
                    {notifications.length > 0 && (
                        <button
                            className="btn btn-error btn-md"
                            onClick={(e) => { e.stopPropagation(); clearAll(); }}
                        >
                            <PiTrash className="size-5" />
                        </button>
                    )}
                </div>

                {/* List */}
                <ul className="overflow-y-auto max-h-80 divide-y divide-base-300">
                    {notifications.length === 0 ? (
                        <li className="px-4 py-8 text-center text-base-content/50 text-sm">
                            Sin notificaciones
                        </li>
                    ) : (
                        notifications.map((n) => {
                            const sev = SEVERITY[n.severity] ?? SEVERITY.info;
                            return (
                                <li
                                    key={n.id}
                                    className={`flex items-start rounded-box gap-3 px-4 py-3 m-3 transition-colors hover:bg-base-300 ${!n.read ? "bg-base-300/50" : ""}`}
                                >
                                    <span className="mt-0.5 text-base select-none">{sev.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm wrap-words leading-snug">{n.message}</p>
                                        <span className="text-xs text-base-content/40 mt-0.5 block">
                                            {formatTime(n.timestamp)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-xs text-base-content/30 hover:text-error ml-1 shrink-0"
                                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                        title="Descartar"
                                    >
                                        <PiX className="size-5" />
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </details>
    );
};

export default NotificationBell;
