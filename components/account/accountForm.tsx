import { useState, useEffect } from "react";
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RadioButton } from "react-native-paper";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

const AccountFormScreen = () => {
    const navigation = useNavigation();

    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        (async () => {
            await Camera.requestCameraPermissionsAsync();
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        navigation.navigate("account", {
            avatar,
            username,
            email,
            gender,
            aboutMe
        });
    };

    const resetForm = () => {
        setAvatar(null);
        setUsername("");
        setEmail("");
        setGender("");
        setAboutMe("");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={
                            avatar
                                ? { uri: avatar }
                                : require("@/assets/images/default-avatar.png")
                        }
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.buttonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>From Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioGroup}>
                    <View style={styles.radioButton}>
                        <RadioButton.Android
                            value="male"
                            status={gender === "male" ? "checked" : "unchecked"}
                            onPress={() => setGender("male")}
                        />
                        <Text>Male</Text>
                    </View>
                    <View style={styles.radioButton}>
                        <RadioButton.Android
                            value="female"
                            status={
                                gender === "female" ? "checked" : "unchecked"
                            }
                            onPress={() => setGender("female")}
                        />
                        <Text>Female</Text>
                    </View>
                    <View style={styles.radioButton}>
                        <RadioButton.Android
                            value="other"
                            status={
                                gender === "other" ? "checked" : "unchecked"
                            }
                            onPress={() => setGender("other")}
                        />
                        <Text>Other</Text>
                    </View>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>About me</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Tell us about yourself"
                    value={aboutMe}
                    onChangeText={setAboutMe}
                    multiline
                />
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={resetForm}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 40,
        alignItems: "center",
        backgroundColor: "#DCD7C9",
        gap: 15
    },
    avatarContainer: {
        justifyContent: "center"
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        marginHorizontal: "auto"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
        gap: 20
    },
    inputContainer: { width: "100%", marginBottom: 10 },
    label: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    radioGroup: { flexDirection: "row", justifyContent: "space-around" },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10
    },
    button: {
        backgroundColor: "#2C3930",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3
    },
    secondaryButton: {
        backgroundColor: "#3F4F44"
    },
    buttonText: { color: "#DCD7C9", fontSize: 16, fontWeight: "bold" },
    picker: {
        width: "100%"
    }
});

export default AccountFormScreen;
