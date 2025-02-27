import { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import { type Knife } from "@/models/Knife";
import { BACKEND_URL } from "@/environment/development";

const KnivesScreen = () => {
    const [knives, setKnives] = useState<Knife[]>([]);

    useEffect(() => {
        const fetchKnives = async () => {
            try {
                const response = await fetch(BACKEND_URL + "knives");
                const data = await response.json();
                setKnives(data.knives);
            } catch (error) {}
        };
        fetchKnives();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {knives.map(item => (
                <View key={item.id} style={styles.card}>
                    <View style={styles.topSection}>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>{item.price} $</Text>
                            <Text style={styles.brand}>
                                Brand: {item.brand}
                            </Text>
                        </View>
                        <Image
                            source={{
                                uri: `data:image/png;base64,${item.images[0]}`
                            }}
                            style={styles.image}
                        />
                    </View>
                    <Text style={styles.details}>
                        Blade Length: {item.blade_length} cm
                    </Text>
                    <Text style={styles.details}>Weight: {item.weight} g</Text>
                    <Text style={styles.details}>
                        Handle: {item.handle_material.replace("_", " ")}
                    </Text>
                    <Text style={styles.details}>
                        Steel: {item.steel_type.replace("_", " ")}
                    </Text>
                    <Text style={styles.description}>
                        Description: {item.description}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { padding: 10, paddingTop: 40, alignItems: "center" },
    card: {
        backgroundColor: "white",
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        width: "90%"
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    textContainer: { flex: 1 },
    image: { width: 100, height: 100, borderRadius: 5 },
    name: { fontSize: 18, fontWeight: "bold" },
    price: { fontSize: 16, fontWeight: "bold", color: "green" },
    brand: { fontSize: 16, color: "black", fontWeight: "bold", marginTop: 5 },
    details: { fontSize: 14, color: "gray" },
    description: {
        fontSize: 14,
        color: "gray",
        marginVertical: 7,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "lightgray"
    }
});

export default KnivesScreen;
