import { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import { Order } from "@/models/Order";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BACKEND_URL } from "@/environment/development";
import EmptyFallback from "./EmptyFallback";

const AdminCartsList = () => {
    const [carts, setCarts] = useState<Order[]>([]);

    useEffect(() => {
        fetchCarts();
    }, []);

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
            const data = await response.json();
            setCarts(data.orders);
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
                    carts.map((x: Order) => (
                        <OrderRow
                            order={x}
                            key={x.id}
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
    formContainer: { marginBottom: 20 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white",
        width: "48%",
        fontSize: 16,
        color: "#000",
        paddingLeft: 8
    },
    inputFull: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white",
        width: "100%",
        fontSize: 16,
        color: "#000",
        paddingLeft: 8
    },
    knifeList: {
        marginTop: 10,
        maxHeight: 300
    }
});

export default AdminCartsList;
