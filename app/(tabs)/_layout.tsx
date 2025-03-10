import { Tabs } from "expo-router";
import { User } from "@/models/User";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabBarBackground from "@/components/ui/TabBarBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            const value = await AsyncStorage.getItem("user");
            const userInfo = value != null ? JSON.parse(value) : null;
            if (userInfo) setUser(userInfo);
        };

        getUserInfo();
    }, []);

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
                    title: "Account",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="person.fill.badge.plus"
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="KnivesScreen"
                options={{
                    title: "Knives",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="fork.knife.circle"
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="CartScreen"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="cart.fill" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
