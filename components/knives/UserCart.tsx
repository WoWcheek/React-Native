import { useState, useCallback } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View,
    Switch
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KnifeCard from "@/components/knives/KnifeCard";
import { BACKEND_URL } from "@/environment/development";
import { type Knife } from "@/models/Knife";
import EmptyFallback from "@/components/knives/EmptyFallback";
import { useFocusEffect } from "@react-navigation/native";

const UserCart = () => {
    const [knives, setKnives] = useState<Knife[]>([]);
    const [amounts, setAmounts] = useState<number[]>([]);
    const [showBought, setShowBought] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchCart = async () => {
                const value = await AsyncStorage.getItem("user");
                const userInfo = value != null ? JSON.parse(value) : null;

                if (!userInfo || !userInfo.token)
                    return <EmptyFallback text="Sign in to view cart!" />;

                try {
                    const response = await fetch(
                        BACKEND_URL +
                            `orders/${userInfo.id}?is_payed=${
                                showBought ? 1 : 0
                            }`
                    );
                    const data = await response.json();

                    const firstItems = [];
                    const secondItems = [];
                    for (const item of data?.items) {
                        firstItems.push(item[0]);
                        secondItems.push(item[1]);
                    }

                    setKnives(firstItems);
                    setAmounts(secondItems);
                } catch {
                    setKnives([]);
                    setAmounts([]);
                    return <EmptyFallback text="Your cart is empty..." />;
                }
            };
            fetchCart();
        }, [showBought])
    );

    const handlePayment = async () => {
        const value = await AsyncStorage.getItem("user");
        const userInfo = value != null ? JSON.parse(value) : null;

        if (!userInfo || !userInfo.token) {
            Alert.alert("Please sign in to pay for your order.");
            return;
        }

        try {
            const response = await fetch(
                BACKEND_URL + `orders/${userInfo.id}/pay`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            );

            if (response.ok) {
                Alert.alert("Payment Successful!", "Your order has been paid.");
                setShowBought(true);
            } else {
                Alert.alert(
                    "Payment Failed",
                    "There was an issue with the payment."
                );
            }
        } catch (error) {
            console.error("Payment Error:", error);
            Alert.alert(
                "Payment Failed",
                "An error occurred while processing the payment."
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your cart</Text>
                <View style={styles.switchContainer}>
                    <Switch value={showBought} onValueChange={setShowBought} />
                </View>
                <Text style={styles.title}>Your buys</Text>
            </View>
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
                {knives.length > 0 && !showBought && (
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={handlePayment}>
                        <Text style={styles.buttonText}>
                            Pay for order - $
                            {knives.reduce(
                                (cum, cur, i) => cum + cur.price * amounts[i],
                                0
                            )}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10, paddingTop: 50, marginBottom: 30 },
    header: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 10
    },
    title: { fontSize: 24, fontWeight: "bold" },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3
    },
    scrollContainer: { padding: 10, alignItems: "center" },
    payButton: {
        backgroundColor: "green",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: "90%"
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default UserCart;
