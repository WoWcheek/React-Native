import {
    Text,
    View,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Knife } from "@/models/Knife";
import { BACKEND_URL } from "@/environment/development";
import { MaterialIcons } from "@expo/vector-icons";

const KnifeCard = ({ knife, amount }: { knife: Knife; amount?: number }) => {
    const navigator = useNavigation();

    const handleAddToCart = async () => {
        try {
            const value = await AsyncStorage.getItem("user");
            const userInfo = value ? JSON.parse(value) : null;

            if (!userInfo?.token) {
                alert("Sign in to add items to cart!");
                navigator.navigate("index");
                return;
            }

            Alert.prompt(
                "Input required",
                `Enter amount of ${knife.name} to add to cart`,
                async amount => {
                    if (!amount || +amount < 1) {
                        alert(
                            "Knife amount should be an integer greater than 0."
                        );
                        return;
                    }

                    try {
                        const response = await fetch(
                            BACKEND_URL + "orders/add",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `${userInfo.token}`
                                },
                                body: JSON.stringify({
                                    user_id: userInfo.id,
                                    items: [knife.id, +amount],
                                    is_payed: false
                                })
                            }
                        );

                        if (!response.ok) throw new Error();

                        alert(`${knife.name} added to cart!`);
                    } catch {
                        alert("You can't add this item to cart!");
                    }
                },
                "plain-text"
            );
        } catch {
            alert("Error while adding the item to the cart.");
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.topSection}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{knife.name}</Text>
                    <Text style={styles.price}>${knife.price}</Text>
                    <Text style={styles.brand}>{knife.brand}</Text>
                </View>
                <Image
                    source={{ uri: `data:image/png;base64${knife.images[0]}` }}
                    style={styles.image}
                />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.details}>
                    Blade Length: {knife.blade_length} cm
                </Text>
                <Text style={styles.details}>Weight: {knife.weight} g</Text>
                <Text style={styles.details}>
                    Handle: {knife.handle_material.replace("_", " ")}
                </Text>
                <Text style={styles.details}>
                    Steel: {knife.steel_type.replace("_", " ")}
                </Text>
            </View>
            <Text style={styles.description}>{knife.description}</Text>
            {amount ? (
                <Text style={styles.count}>{amount} items</Text>
            ) : (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddToCart}>
                    <MaterialIcons
                        name="shopping-cart"
                        size={20}
                        color="white"
                    />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default KnifeCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        marginVertical: 12,
        borderRadius: 12,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        width: "90%",
        alignSelf: "center"
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    textContainer: {
        flex: 1,
        marginRight: 12
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10
    },
    count: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444",
        alignSelf: "flex-end",
        marginTop: 8
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#28a745",
        marginBottom: 2
    },
    brand: {
        fontSize: 14,
        color: "#555"
    },
    detailsContainer: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 8
    },
    details: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginTop: 10,
        lineHeight: 18
    },
    addButton: {
        marginTop: 12,
        backgroundColor: "#007bff",
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
});
