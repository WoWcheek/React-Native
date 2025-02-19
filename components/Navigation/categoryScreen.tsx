import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const CategoryScreen = () => {
    const destinations = ["Paris", "Tokyo", "NewYork"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Category</Text>
            </View>

            <Text style={styles.title}>Choose your Destination!</Text>
            {destinations.map(places => (
                <TouchableOpacity
                    key={places}
                    style={styles.touchableOpacity}
                    onPress={() => {
                        router.push({
                            pathname: "/(cities)/" + places
                        });
                    }}>
                    <Text style={styles.buttonText}>{places}</Text>
                </TouchableOpacity>
            ))}
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
        marginTop: "25%",
        color: "#097969"
    },
    touchableOpacity: {
        backgroundColor: "#4CBB17",
        padding: 20,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 10,
        width: "90%"
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        color: "#097969"
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16
    }
});

export default CategoryScreen;
