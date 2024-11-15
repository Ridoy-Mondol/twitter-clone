"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/utilities/fetch";
import { NotificationProps } from "@/types/NotificationProps";

const supabaseUrl = "https://edduuatujlvepjzkvtau.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZHV1YXR1amx2ZXBqemt2dGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMDkwNDMsImV4cCI6MjA0Njg4NTA0M30._bT8Un-DaoDE30O-jPSmP4_ZCGnBIn56miAZPr1FGzU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UnreadNotificationsBadge() {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        onSuccess: (data) => {
            setNotifications(data.notifications);
        },
    });

    const lengthOfUnreadNotifications =
        notifications?.filter((notification: NotificationProps) => !notification.isRead)?.length ?? 0;

    const animationVariants = {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0 },
    };

    useEffect(() => {
        const channel = supabase
            .channel("realtime:Notification")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "Notification" },
                (payload) => {
                    const newNotification = payload.new as NotificationProps;
                    // Validate the notification fields
                    if (newNotification && newNotification.id && newNotification.type && newNotification.createdAt) {
                        setNotifications((prev) => [newNotification, ...prev]);
                    } else {
                        console.error("Received invalid notification data:", newNotification);
                        console.log("Payload Structure:", payload);
                    }
                }
            )
            .subscribe((status) => {
                // Check the status of the subscription
                if (status === "SUBSCRIBED") {
                    console.log("Subscribed to real-time notifications.");
                } else {
                    console.error("Error subscribing to real-time notifications:", status);
                }
            });

        // Cleanup subscription when component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <>
            {lengthOfUnreadNotifications > 0 && (
                <motion.span
                    className="badge"
                    variants={animationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {lengthOfUnreadNotifications}
                </motion.span>
            )}
        </>
    );
}
