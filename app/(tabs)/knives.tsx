import { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KnifeCard from "@/components/knives/KnifeCard";
import { BACKEND_URL } from "@/environment/development";
import { type Knife } from "@/models/Knife";

const KnivesScreen = () => {
    const [knives, setKnives] = useState<Knife[]>([]);
    const [user, setUser] = useState<{ id: number; token: string } | null>(
        null
    );

    useEffect(() => {
        const fetchKnives = async () => {
            try {
                const response = await fetch(BACKEND_URL + "knives");
                const data = await response.json();
                setKnives(data.knives);
            } catch (error) {}
        };

        const getUserInfo = async () => {
            const value = await AsyncStorage.getItem("user");
            const userInfo = value != null ? JSON.parse(value) : null;

            if (userInfo) setUser(userInfo);
        };

        getUserInfo();
        fetchKnives();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {knives.map(knife => (
                <KnifeCard knife={knife} key={knife.id} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { padding: 10, paddingTop: 40, alignItems: "center" }
});

export default KnivesScreen;
