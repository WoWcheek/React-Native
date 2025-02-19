import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface WeaponCardProps {
    weapon: Weapon;
}

export interface Weapon {
    brand: string;
    imageUri: string;
    isSale: boolean;
    isSalesHit: boolean;
    isTop: boolean;
    isAvailable: boolean;
    title: string;
    initialPrice: string;
    discount: string;
    finalPrice: string;
}

const Card = ({
    weapon: {
        brand,
        imageUri: uri,
        isSale,
        isSalesHit,
        isTop,
        isAvailable,
        title,
        initialPrice,
        discount,
        finalPrice
    }
}: WeaponCardProps) => {
    return (
        <View style={styles.card}>
            <Text style={styles.brand}>{brand}</Text>
            <Image
                source={{
                    uri
                }}
                style={styles.image}
            />
            <View style={styles.badgesContainer}>
                {isSale && (
                    <Text style={[styles.badge, styles.sale]}>Акція</Text>
                )}
                {isSalesHit && (
                    <Text style={[styles.badge, styles.hit]}>Хіт продажу</Text>
                )}
                {isTop && <Text style={[styles.badge, styles.top]}>Топ</Text>}
            </View>
            {isAvailable ? (
                <Text style={styles.inStock}>✔ В наявності</Text>
            ) : (
                <Text style={styles.outOfStock}>Немає в наявності</Text>
            )}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.oldPrice}>{initialPrice} грн</Text>
                <Text style={styles.discount}>-{discount}%</Text>
            </View>
            <Text style={styles.newPrice}>{finalPrice} грн</Text>
            <TouchableOpacity style={styles.cartButton}>
                <Image
                    source={require("@/assets/images/cart.png")}
                    style={{ height: 20, aspectRatio: 1 }}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        height: 450,
        width: 350
    },
    brand: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginBottom: 10
    },
    badgesContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        fontSize: 12,
        color: "#fff",
        marginRight: 5
    },
    sale: { backgroundColor: "red" },
    hit: { backgroundColor: "orange" },
    top: { backgroundColor: "green" },
    inStock: {
        color: "green",
        fontSize: 14,
        marginBottom: 5
    },
    outOfStock: {
        color: "red",
        fontSize: 14,
        marginBottom: 5
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        left: 15
    },
    oldPrice: {
        textDecorationLine: "line-through",
        color: "#888",
        marginRight: 5
    },
    discount: {
        backgroundColor: "green",
        color: "white",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        fontSize: 12
    },
    newPrice: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 5,
        position: "absolute",
        bottom: 15,
        left: 15
    },
    cartButton: {
        position: "absolute",
        bottom: 15,
        right: 15,
        backgroundColor: "#F7F8FB",
        padding: 10
    },
    cartText: {
        fontSize: 24
    }
});

export default Card;
