import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const OtpRequestScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      console.log("📡 Sending OTP request to:", `http://192.168.1.102:5000/auth/send-otp`);

      const response = await fetch("http://192.168.1.102:5000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log("✅ Raw Response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        Alert.alert("Error", `Server Error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Parsed Response:", data);

      if (data.success) {
        Alert.alert("Success", "OTP Sent!");
        navigation.navigate("VerifyOTP", { phoneNumber });
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      Alert.alert("Error", "Could not connect to server. Check network & backend.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ OTP Request Card */}
      <View style={styles.card}>
        {/* ✅ Phone Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="phone-android" size={60} color="#6A1B9A" />
        </View>

        <Text style={styles.title}>Enter Your Phone Number</Text>

        {/* ✅ Phone Number Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#6A1B9A" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3E5F5", // ✅ Light Purple Background
    padding: 20,
  },
  card: {
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#D1C4E9",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A148C",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE7F6",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#6A1B9A",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#4A148C",
  },
  button: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OtpRequestScreen;
