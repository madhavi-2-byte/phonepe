import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 

const VerifyOtpScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(true); 
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    if (text.length > 1) return;

    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter a valid OTP.");
      return;
    }

    try {
      console.log("📡 Sending OTP verification request to:", `http://192.168.1.102:5000/auth/verify-otp`);

      const response = await fetch("http://192.168.1.102:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: enteredOtp }),
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
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <MaterialIcons name="sms" size={50} color="#7B1FA2" />
            <Text style={styles.popupText}>OTP has been sent to {phoneNumber}</Text>
            <TouchableOpacity style={styles.popupButton} onPress={() => setShowPopup(false)}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="lock" size={60} color="#7B1FA2" />
        </View>

        <Text style={styles.title}>Enter OTP</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify OTP</Text>
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
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#E1BEE7",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A148C",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  otpBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#7B1FA2",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#7B1FA2",
    backgroundColor: "#E1BEE7",
  },
  button: {
    backgroundColor: "#7B1FA2",
    paddingVertical: 14,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
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
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  popupButton: {
    marginTop: 10,
    backgroundColor: "#7B1FA2",
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
