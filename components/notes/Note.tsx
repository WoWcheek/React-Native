import { useState } from "react";
import { Text, View, StyleSheet, Switch, Pressable } from "react-native";

interface NoteProps {
    title: string;
    description: string;
}

const Note = (props: NoteProps) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleCheckbox = () => setIsEnabled(x => !x);

    return (
        <View style={styles.container}>
            <Pressable
                onPress={toggleCheckbox}
                style={[styles.checkbox, isEnabled && styles.checkboxChecked]}>
                {isEnabled && <Text style={styles.checkmark}>✔</Text>}
            </Pressable>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.description}>{props.description}</Text>
        </View>
    );
};

export default Note;

const styles = StyleSheet.create({
    container: {
        height: 250,
        width: 165,
        backgroundColor: "#ffede1",
        padding: 12,
        borderRadius: 15,
        shadowColor: "#bdbdbd",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        alignItems: "center",
        justifyContent: "flex-start",
        borderWidth: 2,
        borderColor: "#ffc1cc"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#6d597a",
        marginTop: 16,
        textAlign: "center",
        borderBottomWidth: 1.5
    },
    description: {
        fontSize: 16,
        color: "#355070",
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 10
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#6d597a",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end"
    },
    checkboxChecked: {
        backgroundColor: "#ffb3ba",
        borderColor: "#ff4f69"
    },
    checkmark: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});
