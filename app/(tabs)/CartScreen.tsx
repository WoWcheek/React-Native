import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { User } from "@/models/User";
import UserCart from "@/components/knives/UserCart";
import AdminCartsList from "@/components/knives/AdminCartsList";

const CartScreen = () => {
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

    return userInfo?.role === 1 ? <AdminCartsList /> : <UserCart />;
};

export default CartScreen;
