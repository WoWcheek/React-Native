import { useCallback, useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import { Order } from "@/models/Order";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BACKEND_URL } from "@/environment/development";
import EmptyFallback from "./EmptyFallback";
import { useFocusEffect } from "@react-navigation/native";

const AdminCartsList = () => {
    const [carts, setCarts] = useState<Order[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchCarts();
        }, [])
    );

    const fetchCarts = async () => {
        try {
            const response = await fetch(BACKEND_URL + "orders");
            const data = await response.json();
            setCarts(data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(BACKEND_URL + "orders/" + id, {
                method: "DELETE"
            });

            if (!response.ok) {
                alert("Error deleting order!");
                return;
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders Admin Panel</Text>
            </View>

            <ScrollView style={styles.knifeList}>
                {carts?.length ? (
                    carts.map((x: Order, i) => (
                        <OrderRow
                            order={x}
                            key={i}
                            handleDelete={handleDelete}
                        />
                    ))
                ) : (
                    <EmptyFallback text="No orders from users..." />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 50 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    title: { fontSize: 24, fontWeight: "bold" },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    knifeList: {
        marginTop: 10
    }
});

export default AdminCartsList;
