import { useState, useCallback } from "react";
import { User } from "@/models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import KnivesList from "@/components/knives/KnivesList";
import { useFocusEffect } from "@react-navigation/native";
import KnivesAdminPanel from "@/components/knives/KnivesAdminPanel";

const KnivesScreen = () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useFocusEffect(
        useCallback(() => {
            const checkUser = async () => {
                const storedUser = await AsyncStorage.getItem("user");
                setUserInfo(storedUser ? JSON.parse(storedUser) : null);
            };

            checkUser();
        }, [])
    );

    return userInfo?.role === 1 ? <KnivesAdminPanel /> : <KnivesList />;
};

export default KnivesScreen;
