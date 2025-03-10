import { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KnifeCard from "@/components/knives/KnifeCard";
import { BACKEND_URL } from "@/environment/development";
import { type Knife } from "@/models/Knife";
import EmptyFallback from "@/components/knives/EmptyFallback";

const CartScreen = () => {
    const [knives, setKnives] = useState<Knife[]>([]);
    const [amounts, setAmounts] = useState<number[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            const value = await AsyncStorage.getItem("user");
            const userInfo = value != null ? JSON.parse(value) : null;

            if (!userInfo || !userInfo.token)
                return <EmptyFallback text="Sign in to view cart!" />;

            try {
                const response = await fetch(
                    BACKEND_URL + `orders/${userInfo.id}?is_payed=0`
                );
                const data = await response.json();

                const firstItems = [];
                const secondItems = [];
                for (const item of data.items) {
                    firstItems.push(item[0]);
                    secondItems.push(item[1]);
                }

                setKnives(firstItems);
                setAmounts(secondItems);
            } catch {
                return <EmptyFallback text="Your cart is empty..." />;
            }
        };

        fetchCart();
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {knives?.length ? (
                knives.map((knife, i) => (
                    <KnifeCard
                        knife={knife}
                        key={knife.id}
                        amount={amounts[i]}
                    />
                ))
            ) : (
                <EmptyFallback text="Your cart is empty..." />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { padding: 10, paddingTop: 40, alignItems: "center" }
});

export default CartScreen;
