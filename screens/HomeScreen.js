import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://192.168.1.112:5000"; // Replace with your backend URL

const CoinSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userBalance = useSelector((state) => state.wallet.balance);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    fetchBalanceFromServer();

    // ✅ Connect to Socket.IO for real-time balance updates
    const socket = io(API_URL);
    socket.on("balanceUpdate", async (newBalance) => {
      console.log("🔄 Balance Updated:", newBalance);
      dispatch(setBalance(newBalance));
      await AsyncStorage.setItem("userBalance", JSON.stringify(newBalance));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ Fetch balance from the backend
  const fetchBalanceFromServer = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/balance`);
      if (response.data.success && response.data.balance > 0) {
        dispatch(setBalance(response.data.balance));
        await AsyncStorage.setItem("userBalance", JSON.stringify(response.data.balance));
      } else {
        dispatch(setBalance(0)); // Default balance to 0
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      dispatch(setBalance(0)); // Set balance to 0 in case of error
    }
  };

  // ✅ Handle Coin Selection
  const handleCoinSelect = async (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
    setSelectedAmount(parseInt(numericValue) || 0);
  };

  // ✅ Navigate to Bank Account Screen
  const navigateToBankAccount = () => {
    navigation.navigate("BankAccounts"); // Ensure "BankAccounts" is registered in App.js
  };

  // ✅ Initiate PhonePe Payment
  const initiatePhonePePayment = async () => {
    if (userBalance <= 0) {
      Alert.alert("Insufficient Balance", "You do not have enough balance to make a payment.");
      return;
    }
  
    if (selectedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please select or enter a valid amount.");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/payment/initiate`, { amount: selectedAmount });
  
      if (response.data.success) {
        const { paymentUrl, transactionId } = response.data;
  
        if (await Linking.canOpenURL(paymentUrl)) {
          await Linking.openURL(paymentUrl);
  
          // ✅ Check payment status after 5 seconds
          setTimeout(() => checkPaymentStatus(transactionId), 5000);
        } else {
          Alert.alert("Error", "No UPI app found on your device.");
        }
      } else {
        Alert.alert("Error", response.data.message || "Payment failed.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  // ✅ Check Payment Status
  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await axios.post(`${API_URL}/payment/status`, { transactionId });

      if (response.data.success) {
        Alert.alert("Success", "Payment successful. Balance updated.");
        fetchBalanceFromServer(); // ✅ Update balance only if payment is successful
      } else if (response.data.message === "Payment is still pending. Please check again later.") {
        Alert.alert("Pending", "Your payment is still processing. Please check again later.");
      } else {
        Alert.alert("Error", "Payment failed or cancelled.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      Alert.alert("Error", "Failed to check payment status.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Money</Text>

      {userBalance > 0 && ( // ✅ Show balance only when greater than 0
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{userBalance}</Text>
        </View>
      )}

      <View style={styles.coinGrid}>
        {[50, 100, 500, 1000, 2000, 5000].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.coinButton, selectedAmount === amount ? styles.selectedCoin : {}]}
            onPress={() => handleCoinSelect(amount)}
          >
            <Text style={styles.coinText}>₹{amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ "Enter Custom Amount" Text */}
      <Text style={styles.customAmountText}>Enter Custom Amount</Text>

      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        keyboardType="numeric"
        placeholder="Enter amount"
      />

      {/* ✅ Buy Now Button */}
      <TouchableOpacity
        style={[styles.buyButton, selectedAmount > 0 ? {} : styles.disabledButton]}
        onPress={initiatePhonePePayment}
        disabled={selectedAmount <= 0}
      >
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>

      {/* ✅ Add Bank Account Button */}
      <TouchableOpacity style={styles.bankButton} onPress={navigateToBankAccount}>
        <Text style={styles.bankButtonText}>Add Bank Account</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fd",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
  },
  balanceContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2D9CDB",
  },
  coinGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  coinButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    minWidth: 100,
  },
  selectedCoin: {
    backgroundColor: "#2D9CDB",
  },
  customAmountText: {
    fontSize: 16,
    marginTop: 15,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
  },
  buyButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#2D9CDB",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  bankButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#ff9800",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default CoinSelectionScreen;
