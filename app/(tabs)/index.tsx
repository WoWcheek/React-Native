import React, { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import {
    Text,
    View,
    Image,
    Button,
    Vibration,
    StyleSheet,
    TouchableOpacity
} from "react-native";

const CameraScreen = () => {
    const cameraRef = useRef<CameraView>(null);

    const [facing, setFacing] = useState<CameraType>("back");
    const [photo, setPhoto] = useState<string | null>(null);

    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions();
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission || !mediaPermission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button
                    onPress={requestPermission}
                    title="Grant Camera Permission"
                />
            </View>
        );
    }

    if (!mediaPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to save photos
                </Text>
                <Button
                    onPress={requestMediaPermission}
                    title="Grant Media Permission"
                />
            </View>
        );
    }

    const toggleCameraFacing = () =>
        setFacing(current => (current === "back" ? "front" : "back"));

    const takePhoto = async () => {
        if (!cameraRef.current) return;

        Vibration.vibrate();

        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) return;
        setPhoto(photo.uri);
    };

    async function savePhoto() {
        if (photo) {
            await MediaLibrary.saveToLibraryAsync(photo);
            setPhoto(null);
        }
    }

    return (
        <View style={styles.container}>
            {!photo ? (
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={takePhoto}>
                            <Text style={styles.text}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.preview}>
                    <Image source={{ uri: photo }} style={styles.image} />
                    <View style={styles.actions}>
                        <Button title="Save to Gallery" onPress={savePhoto} />
                        <Button title="Retake" onPress={() => setPhoto(null)} />
                    </View>
                </View>
            )}
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    message: {
        textAlign: "center",
        paddingBottom: 10
    },
    camera: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginBottom: 20
    },
    button: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 10,
        borderRadius: 5
    },
    text: {
        fontSize: 18,
        color: "white"
    },
    preview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "80%"
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 10
    }
});
