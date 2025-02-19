import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const HomeScreen = () => {
    const destinations = ["Paris", "Tokyo", "New York"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Home</Text>
            </View>

            <Text style={styles.title}>Welcome to the Travel App</Text>
            <TouchableOpacity style={styles.touchableOpacity}>
                <Text style={styles.buttonText}>View destinations</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        width: "100%",
        padding: 20,
        backgroundColor: "#4CBB17",
        alignItems: "center",
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: "5%",
        marginTop: "50%",
        color: "#097969"
    },

    touchableOpacity: {
        backgroundColor: "#4CBB17",
        padding: 20,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 40,
        width: "90%"
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16
    }
});

export default HomeScreen;
