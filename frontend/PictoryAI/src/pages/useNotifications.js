import { useState, useCallback } from "react";

const FREE_LIMITS = {
    theme:   3,
    enhance: 3,
    caption: 5,
};

export function useNotifications(userPlan = "free") {
    const [notifications, setNotifications] = useState([]);
    const [usageCount, setUsageCount] = useState({
        theme:   0,
        enhance: 0,
        caption: 0,
    });

    const addNotification = useCallback(({ type }) => {
        const labels = {
            theme:   "Theme Image",
            enhance: "Enhanced Image",
            caption: "Caption",
        };

        const newCount = (usageCount[type] || 0) + 1;
        setUsageCount((prev) => ({ ...prev, [type]: newCount }));

        const isPro = userPlan === "pro";
        const remaining = isPro ? null : FREE_LIMITS[type] - newCount;

        const notification = {
            id: Date.now(),
            message: `${labels[type]} generated successfully`,
            sub: !isPro
                ? remaining > 0
                    ? `You have ${remaining} attempt${remaining === 1 ? "" : "s"} left`
                    : "You've reached your monthly limit"
                : null,
        };

        setNotifications((prev) => [notification, ...prev]);
    }, [usageCount, userPlan]);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        unreadCount: notifications.length,
        addNotification,
        clearNotifications,
    };
}