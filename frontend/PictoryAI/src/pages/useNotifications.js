import { useState, useCallback, useEffect } from "react";

const FREE_LIMITS = {
    theme:   3,
    enhance: 3,
    caption: 3,
    generate: 3,
};

const TYPE_MAP = {
    theme:   "themed_image",
    enhance: "enhance_image",
    caption: "caption",
    generate: "generate_image",

};

export function useNotifications(userPlan = "free", userId = null) {
    const [notifications, setNotifications] = useState([]);
    const [usageCount, setUsageCount] = useState({
        theme:   0,
        enhance: 0,
        caption: 0,
        generate: 0,
    });

    // جيب الأرقام الحقيقية من الداتابيس عند التحميل
    useEffect(() => {
        if (!userId) return;

        async function fetchUsage() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/notifications", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();

                if (data.success) {
                    const map = {};
                    data.notifications.forEach((n) => {
                        const localType = Object.keys(TYPE_MAP).find(
                            (k) => TYPE_MAP[k] === n.type
                        );
                        if (localType) map[localType] = n.used;
                    });
                    setUsageCount((prev) => ({ ...prev, ...map }));
                }
            } catch (e) {
                console.error("Failed to fetch usage", e);
            }
        }

        fetchUsage();
    }, [userId]);

    const addNotification = useCallback(({ type }) => {
        const labels = {
            theme:   "Theme Image",
            enhance: "Enhanced Image",
            caption: "Caption",
            generate: "Generated Image",
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