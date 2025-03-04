import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const OtpRequestScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.112:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "OTP Sent!");
        navigation.navigate("VerifyOTP", { phoneNumber });
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Call Icon at the Top */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="phone-android" size={80} color="#2D9CDB" />
      </View>

      <Text style={styles.title}>Enter Your Phone Number</Text>

      {/* ✅ Phone Number Input with Icon */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={24} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* ✅ Send OTP Button */}
      <TouchableOpacity style={styles.button} onPress={sendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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

export default OtpRequestScreen;
