import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { type Weapon } from "./Card";
import { AntDesign } from "@expo/vector-icons";

interface PaginatorProps {
    title: string;
    items: Weapon[];
    renderChild: (item: Weapon, i: number) => JSX.Element;
}

const Paginator = ({ title, items, renderChild }: PaginatorProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextItem = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevItem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <View style={styles.paginator}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.pagination}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            currentIndex === 0 && styles.notClickable
                        ]}
                        onPress={prevItem}>
                        <AntDesign name="left" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            currentIndex === items.length - 1 &&
                                styles.notClickable
                        ]}
                        onPress={nextItem}>
                        <AntDesign name="right" size={16} />
                    </TouchableOpacity>
                </View>
            </View>
            {renderChild(items[currentIndex], currentIndex)}
        </View>
    );
};

const styles = StyleSheet.create({
    paginator: {
        marginTop: 50,
        alignItems: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "light",
        letterSpacing: 1,
        alignSelf: "flex-start"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 350,
        paddingHorizontal: 10
    },
    pagination: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        gap: 10,
        marginBottom: 10
    },
    navButton: {
        backgroundColor: "#F7F8FB",
        padding: 5,
        textAlign: "center",
        borderRadius: 5
    },
    notClickable: {
        opacity: 0.5
    }
});

export default Paginator;
