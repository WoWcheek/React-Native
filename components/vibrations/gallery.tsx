import { useState } from "react";
import { View, Image, Button, Vibration, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function GalleryScreen() {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            Vibration.vibrate();
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Pick an image from camera roll"
                onPress={pickImage}
            />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: 200,
        height: 200
    }
});
