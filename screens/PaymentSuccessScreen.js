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
      console.log("🔄 Sending payment request...");

      const response = await axios.post("http://192.168.1.104:5000/payment/initiate", {
        amount: parseFloat(amount),
      });

      console.log("✅ Full Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.paymentUrl) {
        const paymentUrl = response.data.paymentUrl;
        console.log("🌐 Redirecting to:", paymentUrl);

        const supported = await Linking.canOpenURL(paymentUrl);
        if (supported) {
          await Linking.openURL(paymentUrl);
        } else {
          Alert.alert("Error", "No UPI app found on your device.");
        }
      } else {
        Alert.alert("Error", response.data.message || "Payment initiation failed.");
      }
    } catch (error) {
      console.error("❌ Payment error:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ["#1c1c1e", "#121212"] : ["#673AB7", "#512DA8"]}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PhonePe Payment</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.amountLabel}>Enter Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="#aaa"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
          <Text style={styles.payButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PaymentScreen;
