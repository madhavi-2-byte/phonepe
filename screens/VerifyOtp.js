import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const VerifyOtpScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(true); // ✅ SMS Sent Popup State

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid OTP.");
      return;
    }
  
    try {
      console.log("📡 Sending OTP verification request to:", `http://192.168.1.116:5000/auth/verify-otp`);
  
      const response = await fetch("http://192.168.1.116:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
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
        Alert.alert("Success", "OTP Verified!");
        navigation.navigate("CreatePasswordScreen");
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
      {/* ✅ OTP Sent Popup */}
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <MaterialIcons name="sms" size={50} color="#2D9CDB" />
            <Text style={styles.popupText}>OTP has been sent to {phoneNumber}</Text>
            <TouchableOpacity style={styles.popupButton} onPress={() => setShowPopup(false)}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Lock Icon at the Top */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock" size={80} color="#2D9CDB" />
      </View>

      <Text style={styles.title}>Enter OTP</Text>

      {/* ✅ OTP Input Box */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="message" size={24} color="#2D9CDB" />
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
      </View>

      {/* ✅ Verify Button */}
      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // ✅ White Background
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
  },
  button: {
    backgroundColor: "#2D9CDB", // ✅ Blue Button
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
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  popupText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  popupButton: {
    marginTop: 10,
    backgroundColor: "#2D9CDB", // ✅ Blue Popup Button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VerifyOtpScreen;
