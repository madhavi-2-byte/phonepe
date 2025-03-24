import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import axios from "axios";

const API_URL = "http://192.168.1.116:5000/api/wallet/deduct"; // ✅ Update with your backend URL

const DeductMoneyScreen = ({ navigation }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const deductMoney = async () => {
    if (!accountNumber || !amount || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid account number and amount.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        accountNumber,
        amount: parseFloat(amount),
      });

      if (response.data.success) {
        dispatch(setBalance(response.data.balance));
        Alert.alert("✅ Success", "Money deducted successfully.");
        navigation.goBack(); // Navigate back to HomeScreen
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
      <Text style={styles.title}>Withdraw Money from Wallet</Text>

      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        placeholder="Enter Bank Account Number"
      />

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter Amount"
      />

      <TouchableOpacity style={styles.button} onPress={deductMoney}>
        <Text style={styles.buttonText}>Withdraw Money</Text>
      </TouchableOpacity>
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
    backgroundColor: "#D9534F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default DeductMoneyScreen;
