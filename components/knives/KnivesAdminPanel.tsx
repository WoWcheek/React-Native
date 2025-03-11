import { useEffect, useState } from "react";
import {
    Text,
    View,
    Alert,
    Image,
    Button,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import KnifeRow from "./KnifeRow";
import { Knife } from "@/models/Knife";
import ImageUploader from "./ImageUploader";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKEND_URL } from "@/environment/development";
import { allowedSteelTypes } from "@/constants/SteelTypes";
import { allowedHandleMaterials } from "@/constants/HandleMaterials";

const KnivesAdminPanel = () => {
    const [knives, setKnives] = useState<Knife[]>([]);

    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [weight, setWeight] = useState("");
    const [steelType, setSteelType] = useState("");
    const [description, setDescription] = useState("");
    const [bladeLength, setBladeLength] = useState("");
    const [handleMaterial, setHandleMaterial] = useState("");

    const [imagesStrs, setImageStrs] = useState<string[]>([]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);

    const [knifeToEditId, setKnifeToEditId] = useState<number | null>(null);

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

    const resetForm = () => {
        setName("");
        setBrand("");
        setPrice("");
        setAmount("");
        setWeight("");
        setImageStrs([]);
        setSteelType("");
        setBladeLength("");
        setDescription("");
        setIsExpanded(false);
        setHandleMaterial("");
        setKnifeToEditId(null);
        setIsEditingMode(false);
    };

    const handleChange = (
        text: string,
        setter: React.Dispatch<React.SetStateAction<string>>,
        allowedValues: string[]
    ) => {
        if (
            !allowedValues ||
            allowedValues.some((x: string) =>
                x.startsWith(text.toLocaleLowerCase().replaceAll(" ", "_"))
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
        if (
            !allowedSteelTypes.includes(
                steelType.toLocaleLowerCase().replaceAll(" ", "_")
            )
        ) {
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
                handleMaterial.toLocaleLowerCase().replaceAll(" ", "_")
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

        const response = isEditingMode
            ? await sendEditRequest()
            : await sendAddRequest();

        if (!response.ok) {
            alert("Invalid knife data!");
            return;
        }

        resetForm();
        fetchKnives();
    };

    const sendAddRequest = async () => {
        return await fetch(BACKEND_URL + "knives/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                brand,
                amount,
                weight,
                description,
                images: imagesStrs,
                blade_length: bladeLength,
                price: price.replace(",", "."),
                handle_material: handleMaterial
                    .toLocaleLowerCase()
                    .replaceAll(" ", "_"),
                steel_type: steelType.toLocaleLowerCase().replaceAll(" ", "_")
            })
        });
    };

    const sendEditRequest = async () => {
        return await fetch(BACKEND_URL + "knives/" + knifeToEditId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                brand,
                amount,
                weight,
                description,
                images: imagesStrs,
                blade_length: bladeLength,
                price: price.replace(",", "."),
                handle_material: handleMaterial
                    .toLocaleLowerCase()
                    .replaceAll(" ", "_"),
                steel_type: steelType.toLocaleLowerCase().replaceAll(" ", "_")
            })
        });
    };

    const handleEdit = async (id: number) => {
        const knifeToEdit = knives.find(x => x.id === id);

        if (!knifeToEdit) {
            Alert.alert("Invalid knife id", `Can't find a knife # ${id}`);
            return;
        }

        setIsExpanded(true);
        setIsEditingMode(true);

        setImageStrs([]);
        setName(knifeToEdit.name);
        setBrand(knifeToEdit.brand);
        setSteelType(knifeToEdit.steel_type);
        setPrice(knifeToEdit.price.toString());
        setDescription(knifeToEdit.description);
        setAmount(knifeToEdit.amount.toString());
        setWeight(knifeToEdit.weight.toString());
        setHandleMaterial(knifeToEdit.handle_material);
        setBladeLength(knifeToEdit.blade_length.toString());

        setKnifeToEditId(id);
    };

    const handleDelete = async (id: number) => {
        if (!knives.some(x => x.id === id)) {
            Alert.alert("Invalid knife id", `Can't delete a knife # ${id}`);
            return;
        }

        const response = await fetch(BACKEND_URL + "knives/" + id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            Alert.alert("Invalid knife id!");
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

                    <Button
                        title={isEditingMode ? "Edit Knife" : "Add Knife"}
                        onPress={handleSubmit}
                    />
                </View>
            )}

            <ScrollView style={styles.knifeList}>
                {knives.map((x: Knife) => (
                    <KnifeRow
                        knife={x}
                        key={x.id}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
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
    }
});

export default KnivesAdminPanel;
