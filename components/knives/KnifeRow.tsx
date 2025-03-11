import { Knife } from "@/models/Knife";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const KnifeRow = ({
    knife,
    handleEdit,
    handleDelete
}: {
    knife: Knife;
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}) => {
    return (
        <View style={styles.knifeItem}>
            <Image source={{ uri: knife.images[0] }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{knife.name}</Text>
                <Text style={styles.brand}>{knife.brand}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => handleEdit(knife.id)}
                    style={styles.iconButton}>
                    <MaterialIcons name="edit" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(knife.id)}
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

export default KnifeRow;
