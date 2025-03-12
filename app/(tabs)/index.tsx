import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { User } from "@/models/User";
import { useNavigation } from "expo-router";
import { BACKEND_URL } from "@/environment/development";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Gallery from "@/components/Camera+Gallery/Gallery";

const AuthScreen = () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            setUserInfo(storedUser ? JSON.parse(storedUser) : null);
        };

        checkUser();
    }, []);

    const handleAuth = async (isAdmin = false) => {
        if (username.trim().length < 4 || password.trim().length < 4) {
            alert("Username and password should contain at least 4 symbols!");
            return;
        }

        const endpoint =
            BACKEND_URL +
            (isSignUp ? "authorization/signup" : "authorization/signin");

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role: +isAdmin })
            });

            if (!response.ok) {
                alert("User already exists!");
                return;
            }

            const data = await response.json();
            const newUser: User = {
                id: data.id,
                role: data.role,
                token: data.token,
                avatar: data.avatar,
                username: data.username
            };
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
            setUserInfo(newUser);

            setUsername("");
            setPassword("");

            setIsSignUp(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        setUserInfo(null);
    };

    if (userInfo) {
        return (
            <View style={styles.container}>
                <Gallery
                    token={userInfo.token}
                    image={userInfo.avatar}
                    username={userInfo.username}
                />
                <Text style={styles.title}>Hi, {userInfo.username}!</Text>
                <Text style={styles.subTitle}>You are logged in!</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="gray"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="gray"
            />
            {isSignUp ? (
                <View style={styles.signupButtons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleAuth(false)}>
                        <Text style={styles.buttonText}>Sign Up as User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleAuth(true)}>
                        <Text style={styles.buttonText}>Sign Up as Admin</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.signupButtons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleAuth()}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleText}>
                    {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa"
    },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    subTitle: { fontSize: 20, marginBottom: 20 },
    input: {
        width: "80%",
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white"
    },
    signupButtons: {
        width: "82.5%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center"
    },
    logoutButton: {
        backgroundColor: "#dc3545",
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignItems: "center"
    },
    buttonText: { color: "white", fontSize: 16 },
    toggleText: { color: "#007bff", marginTop: 10 }
});

export default AuthScreen;
