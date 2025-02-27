import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Battery from "expo-battery";

const HomeScreen = () => {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [charging, setCharging] = useState<boolean | null>(null);
    const [lowPowerMode, setLowPowerMode] = useState<boolean | null>(null);
    const [batteryOptimization, setBatteryOptimization] = useState<
        boolean | null
    >(null);

    useEffect(() => {
        const fetchBatteryStatus = async () => {
            const level = await Battery.getBatteryLevelAsync();
            const chargingStatus = await Battery.getBatteryStateAsync();
            const lowPower = await Battery.isLowPowerModeEnabledAsync();
            const optimization =
                await Battery.isBatteryOptimizationEnabledAsync();

            setBatteryLevel(level);
            setCharging(chargingStatus === Battery.BatteryState.CHARGING);
            setLowPowerMode(lowPower);
            setBatteryOptimization(optimization);
        };

        fetchBatteryStatus();

        const subscription = Battery.addBatteryLevelListener(
            ({ batteryLevel }) => {
                setBatteryLevel(batteryLevel);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    const batteryPercentage =
        batteryLevel !== null ? Math.round(batteryLevel * 100) : 0;
    const batteryColor =
        batteryPercentage > 50
            ? "#00FF00"
            : batteryPercentage > 20
            ? "#FFA500"
            : "#FF0000";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔋 Статус батареи</Text>

            <View style={styles.batteryContainer}>
                <View style={styles.batteryBody}>
                    <View
                        style={[
                            styles.batteryLevel,
                            {
                                width: `${batteryPercentage}%`,
                                backgroundColor: batteryColor
                            }
                        ]}
                    />
                </View>
                <View style={styles.batteryCap} />
            </View>

            <Text style={styles.batteryText}>{batteryPercentage}%</Text>

            <View
                style={[
                    styles.statusBox,
                    charging ? styles.greenBox : styles.redBox
                ]}>
                <Text style={styles.statusText}>
                    {charging ? "⚡ Зарядка..." : "🔌 Не заряжается"}
                </Text>
            </View>

            <View
                style={[
                    styles.statusBox,
                    lowPowerMode ? styles.yellowBox : styles.grayBox
                ]}>
                <Text style={styles.statusText}>
                    {lowPowerMode
                        ? "🛑 Режим энергосбережения ВКЛ"
                        : "✅ Нормальный режим"}
                </Text>
            </View>

            {batteryOptimization !== null && (
                <View
                    style={[
                        styles.statusBox,
                        batteryOptimization ? styles.redBox : styles.greenBox
                    ]}>
                    <Text style={styles.statusText}>
                        {batteryOptimization
                            ? "⛔ Оптимизация батареи ВКЛ"
                            : "✅ Оптимизация батареи ВЫКЛ"}
                    </Text>
                </View>
            )}
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

export default HomeScreen;
