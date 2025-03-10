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

const KnifeCard = ({ knife, amount }: { knife: Knife; amount?: number }) => {
    const navigator = useNavigation();

    const handleAddToCart = async () => {
        try {
            const value = await AsyncStorage.getItem("user");
            const userInfo = value != null ? JSON.parse(value) : null;

            if (!userInfo || !userInfo.token) {
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
                    <Text style={styles.price}>{knife.price} $</Text>
                    <Text style={styles.brand}>Brand: {knife.brand}</Text>
                </View>
                <Image
                    source={{
                        uri: `data:image/png;base64${knife.images[0]}`
                    }}
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
            <Text style={styles.description}>
                Description: {knife.description}
            </Text>
            {amount ? (
                <Text style={styles.count}>{amount} items</Text>
            ) : (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default KnifeCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 20,
        marginVertical: 15,
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        width: "90%",
        alignSelf: "center"
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    textContainer: { flex: 1, marginRight: 10 },
    image: { width: 120, height: 120, borderRadius: 8 },
    count: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        alignSelf: "flex-end"
    },
    name: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "green",
        marginBottom: 5
    },
    brand: { fontSize: 16, color: "gray" },
    detailsContainer: { marginTop: 10 },
    details: { fontSize: 14, color: "gray", marginBottom: 4 },
    description: {
        fontSize: 14,
        color: "gray",
        marginVertical: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "lightgray"
    },
    addButton: {
        marginTop: 15,
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "100%"
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
});
