import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImageUploader = ({
    images,
    setImages
}: {
    images: string[];
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            setImages(x => [selectedImage.uri]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.avatar}
                    />
                ))}
            </View>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 5,
        borderWidth: 2,
        borderColor: "#ccc"
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
    }
});

export default ImageUploader;
