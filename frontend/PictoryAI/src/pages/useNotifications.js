import { useState, useCallback, useEffect } from "react";

const FREE_LIMITS = {
    theme: 3, enhance: 3, caption: 3, generate: 3,
};

const TYPE_MAP = {
    theme: "themed_image",
    enhance: "enhance_image",
    caption: "caption",
    generate: "generate_image",
};

const LABELS = {
    theme: "Theme Image", enhance: "Enhanced Image",
    caption: "Caption", generate: "Generated Image",
};

async function fetchUsageFromAPI() {
    const res = await fetch("http://127.0.0.1:8000/api/notifications", {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    const data = await res.json();
    if (!data.success) throw new Error("Failed");
    return data.notifications; // [{type, used, limit, remaining, label}]
}

export function useNotifications(userPlan = "free", userId = null) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;
        fetchUsageFromAPI().catch(console.error);
    }, [userId]);

    const addNotification = useCallback(async ({ type }) => {
        const isPro = userPlan === "pro";

        let remaining = null;

        if (!isPro) {
            try {
                const freshData = await fetchUsageFromAPI();
                const apiType = TYPE_MAP[type];
                const entry = freshData.find((n) => n.type === apiType);

                if (entry) {
                    remaining = entry.remaining;
                }
            } catch (e) {
                console.error("Failed to fetch usage", e);
            }
        }

        const notification = {
            id: Date.now(),
            message: `${LABELS[type]} generated successfully`,
            sub: !isPro
                ? remaining > 0
                    ? `You have ${remaining} attempt${remaining === 1 ? "" : "s"} left`
                    : "You've reached your monthly limit"
                : null,
        };

        setNotifications((prev) => [notification, ...prev]);
    }, [userPlan]);

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