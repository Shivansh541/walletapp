import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Load user details on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard 🎉</Text>

      {user ? (
        <View style={styles.userBox}>
          <Text style={styles.userText}>👤 Name: {user.name}</Text>
          <Text style={styles.userText}>📧 Email: {user.email}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>Loading user details...</Text>
      )}

      <View style={styles.buttons}>
        <Button
          title="Go to Transactions"
          onPress={() => router.push("/transactions")}
        />
      </View>

      <View style={styles.buttons}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userBox: {
    marginBottom: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
  },
  userText: { fontSize: 16, marginVertical: 5 },
  loading: { fontSize: 16, color: "gray", marginBottom: 20 },
  buttons: { marginVertical: 10, width: "80%" },
});
