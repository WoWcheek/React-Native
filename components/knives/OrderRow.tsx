import { Order } from "@/models/Order";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const OrderRow = ({
    order,
    handleDelete
}: {
    order: Order;
    handleDelete: (id: number) => void;
}) => {
    return (
        <View style={styles.knifeItem}>
            <Image
                source={
                    order.user.avatar
                        ? { uri: order.user.avatar }
                        : require("@/assets/images/default-avatar.png")
                }
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.name}>{order.user.username} - </Text>
                    <Text
                        style={[
                            styles.name,
                            { color: order.is_payed ? "#4CAF50" : "#F44336" }
                        ]}>
                        {order.is_payed ? "Paid" : "Not paid"}
                    </Text>
                </View>

                {order.items.map(x => (
                    <Text style={styles.brand}>{`${x[1]}x ${x[0]}`}</Text>
                ))}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => handleDelete(order.id)}
                    style={styles.iconButton}>
                    <MaterialIcons name="delete" size={24} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    knifeItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12
    },
    textContainer: {
        flex: 1
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    brand: {
        fontSize: 14,
        color: "#777"
    },
    actions: {
        flexDirection: "row"
    },
    iconButton: {
        marginHorizontal: 8
    }
});

export default OrderRow;
