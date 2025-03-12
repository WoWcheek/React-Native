import { ScrollView, StyleSheet } from "react-native";
import KnifeCard from "./KnifeCard";
import EmptyFallback from "./EmptyFallback";
import { BACKEND_URL } from "@/environment/development";
import { useCallback, useState } from "react";
import { Knife } from "@/models/Knife";
import { useFocusEffect } from "@react-navigation/native";

const KnivesList = () => {
    const [knives, setKnives] = useState<Knife[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchKnives = async () => {
                try {
                    const response = await fetch(BACKEND_URL + "knives");
                    const data = await response.json();
                    setKnives(data?.knives ?? []);
                } catch (error) {}
            };

            fetchKnives();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {knives?.length ? (
                knives.map(knife => <KnifeCard knife={knife} key={knife.id} />)
            ) : (
                <EmptyFallback text="There are no knives to show..." />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { padding: 10, paddingTop: 40, alignItems: "center" }
});

export default KnivesList;
