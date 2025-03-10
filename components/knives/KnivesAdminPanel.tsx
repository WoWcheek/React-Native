import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { BACKEND_URL } from "@/environment/development";
import { MaterialIcons } from "@expo/vector-icons";
import ImageUploader from "./ImageUploader"; // Assuming ImageUploader is in the same folder

const allowedHandleMaterials = [
    "wood",
    "plastic",
    "metal",
    "rubber",
    "carbon_fiber"
];

const allowedSteelTypes = [
    "stainless_steel",
    "damascus",
    "carbon_steel",
    "titanium",
    "ceramic"
];

const KnivesAdminPanel = () => {
    const [knives, setKnives] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [brand, setBrand] = useState("");
    const [bladeLength, setBladeLength] = useState("");
    const [weight, setWeight] = useState("");
    const [handleMaterial, setHandleMaterial] = useState("");
    const [steelType, setSteelType] = useState("");
    const [description, setDescription] = useState("");
    const [imagesStrs, setImageStrs] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchKnives();
    }, []);

    const fetchKnives = async () => {
        try {
            const response = await fetch(BACKEND_URL + "knives");
            const data = await response.json();
            setKnives(data.knives);
        } catch (error) {
            console.error("Error fetching knives:", error);
        }
    };

    const handleChange = (
        text: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        allowedValues: string[]
    ) => {
        if (
            !allowedValues ||
            allowedValues.some((x: string) =>
                x.startsWith(text.replaceAll(" ", "_"))
            )
        ) {
            setter(text);
        } else {
            Alert.alert(
                "Invalid Value",
                `Allowed values: ${allowedValues
                    .join(", ")
                    .replaceAll("_", " ")}`
            );
        }
    };

    const handleSubmit = async () => {
        if (!allowedSteelTypes.includes(steelType.replaceAll(" ", "_"))) {
            Alert.alert(
                "Invalid Steel Type Value",
                `Allowed values: ${allowedSteelTypes
                    .join(", ")
                    .replaceAll("_", " ")}`
            );
            return;
        }

        if (
            !allowedHandleMaterials.includes(
                handleMaterial.replaceAll(" ", "_")
            )
        ) {
            Alert.alert(
                "Invalid Handle Material Value",
                `Allowed values: ${allowedHandleMaterials
                    .join(", ")
                    .replaceAll("_", " ")}`
            );
            return;
        }

        const response = await fetch(BACKEND_URL + "knives/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                brand,
                price,
                amount,
                weight,
                description,
                images: imagesStrs,
                steel_type: steelType,
                blade_length: bladeLength,
                handle_material: handleMaterial
            })
        });

        if (!response.ok) {
            alert("Invalid knife data!");
            return;
        }

        fetchKnives();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Knives Admin Panel</Text>
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <MaterialIcons
                        name={isExpanded ? "expand-less" : "expand-more"}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.formContainer}>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Price $"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="Amount in stock"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Brand"
                            value={brand}
                            onChangeText={setBrand}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="Blade length"
                            keyboardType="numeric"
                            value={bladeLength}
                            onChangeText={setBladeLength}
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Weight"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="Handle Material"
                            value={handleMaterial}
                            onChangeText={text =>
                                handleChange(
                                    text,
                                    setHandleMaterial,
                                    allowedHandleMaterials
                                )
                            }
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Steel Type"
                            value={steelType}
                            onChangeText={text =>
                                handleChange(
                                    text,
                                    setSteelType,
                                    allowedSteelTypes
                                )
                            }
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.inputFull}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor="gray"
                        />
                    </View>

                    <ImageUploader
                        images={imagesStrs}
                        setImages={setImageStrs}
                    />

                    <Button title="Add Knife" onPress={handleSubmit} />
                </View>
            )}

            <ScrollView style={styles.knifeList}>
                {knives.map(item => (
                    <View key={item.id} style={styles.knifeItem}>
                        <Image
                            source={{ uri: item.images[0] }}
                            style={styles.image}
                        />
                        <Text>{item.name}</Text>
                        <Button title="Edit" onPress={() => {}} />
                        <Button title="Delete" onPress={() => {}} />
                    </View>
                ))}
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
    },
    knifeItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1
    },
    image: { width: 50, height: 50, marginRight: 10 }
});

export default KnivesAdminPanel;
