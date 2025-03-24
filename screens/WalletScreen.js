import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import axios from "axios";

const API_URL = "http://192.168.1.116:5000/api/wallet"; // ✅ Update with your backend URL

const WalletScreen = () => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.wallet.balance); // ✅ Get balance from Redux
  const [accountNumber, setAccountNumber] = useState("");

  const fetchBalance = async () => {
    if (!accountNumber) {
      Alert.alert("Error", "Please enter a valid bank account number.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/balance`, {
        params: { accountNumber }, // ✅ Send bank account number to backend
      });

      if (response.data.success) {
        dispatch(setBalance(response.data.balance)); // ✅ Update Redux store
      } else {
        Alert.alert("❌ Error", response.data.message);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("❌ API Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Wallet Balance</Text>

      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        placeholder="Enter Bank Account Number"
      />

      <TouchableOpacity style={styles.button} onPress={fetchBalance}>
        <Text style={styles.buttonText}>Check Balance</Text>
      </TouchableOpacity>

      {balance !== null && <Text style={styles.balanceText}>Wallet Balance: ₹{balance}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "90%",
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2D9CDB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  balanceText: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
});

export default WalletScreen;
