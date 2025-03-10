import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyFallback = ({ text }: { text: string }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    text: {
        fontSize: 16,
        color: "black"
    },
    fallbackText: {
        fontSize: 16,
        color: "gray"
    }
});

export default EmptyFallback;
