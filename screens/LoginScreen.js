import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = "http://192.168.1.102:5000"; // Update with your backend URL

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      console.log("📡 Sending login request to:", `${API_URL}/user/login`);

      const response = await axios.post(`${API_URL}/user/login`, {
        phone,
        password,
      });

      console.log("✅ Raw Response:", response);

      if (!response.data.success) {
        console.error("❌ API Error Response:", response.data);
        Alert.alert("Error", response.data.message);
        return;
      }

      console.log("✅ Login Successful:", response.data);
      Alert.alert("Success", "Login successful!");
      navigation.navigate("HomeScreen"); // ✅ Navigate to Home
    } catch (error) {
      console.error("❌ Network/API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Check network & backend.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Login Card */}
      <View style={styles.card}>
        {/* ✅ User Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="person" size={70} color="#fff" />
        </View>

        <Text style={styles.title}>Login</Text>

        {/* ✅ Phone Number Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ✅ Password Input with Eye Icon */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#4a148c"
            />
          </TouchableOpacity>
        </View>

        {/* ✅ Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#4a148c",
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#4a148c",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
