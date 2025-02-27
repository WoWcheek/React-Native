import { useContext, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { BACKEND_URL } from "@/environment/development";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { useNavigation } from "expo-router";

const AuthScreen = () => {
    const navigator = useNavigation();

    const { setToken } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        const endpoint =
            BACKEND_URL +
            (isSignUp ? "authorization/signup" : "authorization/signin");

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            setToken(data?.token);

            setUsername("");
            setPassword("");

            if (isSignUp) {
                alert("Successfully signed up! Please sign in.");
                setIsSignUp(false);
            } else {
                alert("Successfully signed in!");
                navigator.navigate("knives");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthProvider>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.toggleText}>
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </AuthProvider>
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
    input: {
        width: "80%",
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white"
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        width: "80%",
        alignItems: "center"
    },
    buttonText: { color: "white", fontSize: 16 },
    toggleText: { color: "#007bff", marginTop: 10 }
});

export default AuthScreen;
