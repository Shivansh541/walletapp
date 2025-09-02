import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                // 🔥 Change `10.0.2.2` to your backend IP if testing on real device
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert("Error", data.message || "Login failed");
                return;
            }

            // ✅ Save token in AsyncStorage
            await AsyncStorage.setItem("userToken", data.token);

            // ✅ Navigate to dashboard
            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong. Try again later.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Login" onPress={handleLogin} />

            <Text style={styles.signupText}>
                Don’t have an account? <Link href={'/signup'}></Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    signupText: {
        marginTop: 15,
        color: "#007AFF",
        fontWeight: "600",
    },
});
