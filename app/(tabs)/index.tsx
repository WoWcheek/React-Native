import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require("@/assets/images/home-bg.png")}
            style={styles.background}>
            <View style={styles.overlay}>
                <Text style={styles.title}>Welcome to Insta clone</Text>
            </View>
        </ImageBackground>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        marginBottom: 20
    },
    button: {
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000"
    }
});
