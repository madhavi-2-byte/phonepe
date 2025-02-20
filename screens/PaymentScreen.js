import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  TextInput,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const PaymentScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    if (route.params?.amount) {
      setAmount(route.params.amount.toString()); // Set the received amount
    }
  }, [route.params?.amount]);

  const initiatePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.102:5000/payment/initiate", {
        amount: parseFloat(amount),
      });

      if (response.data.success) {
        const paymentUrl = response.data.paymentUrl;
        console.log("Opening Payment URL:", paymentUrl);

        if (await Linking.canOpenURL(paymentUrl)) {
          await Linking.openURL(paymentUrl);
        } else {
          Alert.alert("Error", "No UPI app found on your device.");
        }
      } else {
        Alert.alert("Error", response.data.message || "Payment initiation failed.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ["#1c1c1e", "#121212"] : ["#673AB7", "#512DA8"]}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PhonePe Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Payment Form */}
      <View style={styles.content}>
        <Text style={styles.amountLabel}>Enter Amount</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={22} color="#673AB7" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
          <LinearGradient colors={["#FF9800", "#F57C00"]} style={styles.gradientButton}>
            <Text style={styles.payButtonText}>Proceed to Pay</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  amountLabel: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#333",
  },
  payButton: {
    width: "90%",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
