import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "sticky"
                    },
                    default: {}
                })
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Camera",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="camera" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="gallery"
                options={{
                    title: "Gallery",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="photo" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
