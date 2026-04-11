import { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext(null);

const STORAGE_KEY = "app_notifications";
let _nextId = 1;

// ─── Helpers de localStorage ──────────────────────────────────────────────────
const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        // Restaurar timestamp como Date y sincronizar _nextId
        const notifications = parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
        const maxId = notifications.reduce((max, n) => Math.max(max, n.id), 0);
        _nextId = maxId + 1;
        return notifications;
    } catch {
        return [];
    }
};

const saveToStorage = (notifications) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
        // localStorage lleno o bloqueado, ignorar silenciosamente
    }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => loadFromStorage());

    // Sincronizar localStorage cada vez que cambien las notificaciones
    useEffect(() => {
        saveToStorage(notifications);
    }, [notifications]);

    const notify = useCallback((message, severity = "info") => {
        const newNotif = {
            id: _nextId++,
            message,
            severity,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    }, []);

    const notifyInfo    = useCallback((msg) => notify(msg, "info"),    [notify]);
    const notifySuccess = useCallback((msg) => notify(msg, "success"), [notify]);
    const notifyWarning = useCallback((msg) => notify(msg, "warning"), [notify]);
    const notifyError   = useCallback((msg) => notify(msg, "error"),   [notify]);

    const markRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const dismiss = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => setNotifications([]), []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            notify,
            notifyInfo,
            notifySuccess,
            notifyWarning,
            notifyError,
            markRead,
            markAllRead,
            dismiss,
            clearAll,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
    return ctx;
};