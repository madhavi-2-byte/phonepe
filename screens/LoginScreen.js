import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const API_URL = "http://192.168.1.112:5000"; // Change to your backend URL

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ State to toggle password visibility

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { phone, password });

      if (response.data.success) {
        Alert.alert("Success", "Login successful!");
        navigation.navigate("HomeScreen"); // ✅ Navigate to Home
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ User Icon */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={80} color="#2D9CDB" />
      </View>

      <Text style={styles.title}>Login</Text>

      {/* ✅ Phone Number Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={24} color="#555" />
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
        <MaterialIcons name="lock" size={24} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#2D9CDB" />
        </TouchableOpacity>
      </View>

      {/* ✅ Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  iconContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
