import { StyleSheet, Text, View } from "react-native";

const VolumeStatus = () => {
    const volumePercentage = 70;
    const volumeColor =
        volumePercentage > 70
            ? "#00FF00"
            : volumePercentage > 30
            ? "#FFA500"
            : "#FF0000";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔊 Уровень громкости</Text>
            <View style={styles.volumeContainer}>
                <View style={styles.volumeBar}>
                    <View
                        style={[
                            styles.volumeLevel,
                            {
                                width: `${volumePercentage}%`,
                                backgroundColor: volumeColor
                            }
                        ]}
                    />
                </View>
            </View>
            <Text style={styles.batteryText}>{volumePercentage}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 20
    },
    section: {
        width: "100%",
        alignItems: "center",
        marginBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 20
    },
    batteryContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    batteryBody: {
        width: 160,
        height: 60,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#2E2E2E"
    },
    batteryLevel: {
        height: "100%"
    },
    batteryCap: {
        width: 12,
        height: 25,
        backgroundColor: "#FFFFFF",
        marginLeft: 4,
        borderRadius: 3
    },
    batteryText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 20
    },
    volumeContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    volumeBar: {
        width: 160,
        height: 25,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#2E2E2E"
    },
    volumeLevel: {
        height: "100%"
    },
    statusBox: {
        width: "90%",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center"
    },
    statusText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    greenBox: { backgroundColor: "#008000" },
    redBox: { backgroundColor: "#B22222" },
    yellowBox: { backgroundColor: "#FFA500" },
    grayBox: { backgroundColor: "#808080" }
});

export default VolumeStatus;
