import { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BACKEND_URL } from "@/environment/development";

const AvatarPicker = ({
    image,
    token,
    username
}: {
    image?: string;
    token?: string;
    username?: string;
}) => {
    const [avatar, setAvatar] = useState(
        image ? { uri: image } : require("@/assets/images/default-avatar.png")
    );

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            console.log(
                JSON.stringify({
                    username,
                    token,
                    avatar: result.assets[0].uri
                })
            );

            const response = await fetch(BACKEND_URL + "authorization/avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    token,
                    avatar: result.assets[0].uri
                })
            });

            if (!response.ok) {
                alert("Can't set that image as avatar!");
                return;
            }

            setAvatar({ uri: result.assets[0].uri });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={avatar} style={styles.avatar} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: "#ccc"
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: "#555"
    }
});

export default AvatarPicker;
