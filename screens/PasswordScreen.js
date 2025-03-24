import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const API_URL = "http://192.168.1.116:5000"; // Change to your backend URL

const CreatePasswordScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreatePassword = async () => {
    if (!phone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    try {
      console.log("📡 Sending request to:", `${API_URL}/user/create-password`);
  
      const response = await axios.post(`${API_URL}/user/create-password`, {
        phone,
        password,
        confirmPassword,
      });
  
      console.log("✅ Raw Response:", response);
  
      if (!response.data.success) {
        console.error("❌ API Error Response:", response.data);
        Alert.alert("Error", response.data.message);
        return;
      }
  
      console.log("✅ Password Created:", response.data);
      Alert.alert("Success", "Password created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error) {
      console.error("❌ Network/API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Check network & backend.");
    }
  };
  

  return (
    <View style={styles.container}>
      {/* ✅ Lock Icon at the Top */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock" size={80} color="#2D9CDB" />
      </View>

      <Text style={styles.title}>Create Password</Text>

      {/* ✅ Phone Number Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={24} color="#2D9CDB" />
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
        <MaterialIcons name="lock-outline" size={24} color="#2D9CDB" />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#2D9CDB" />
        </TouchableOpacity>
      </View>

      {/* ✅ Confirm Password Input with Eye Icon */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#2D9CDB" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#2D9CDB" />
        </TouchableOpacity>
      </View>

      {/* ✅ Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreatePassword}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* ✅ Already Have an Account? Login */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
    color: "#2D9CDB",
    textAlign: "center",
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
    borderColor: "#2D9CDB",
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
    color: "#333",
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
  loginButton: {
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    color: "#2D9CDB",
    fontWeight: "bold",
  },
});

export default CreatePasswordScreen;
