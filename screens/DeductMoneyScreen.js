import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import axios from "axios";

const API_URL = "http://192.168.1.102:5000/api/wallet/deduct";

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
        navigation.goBack();
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
      <Text style={styles.title}>Withdraw Money</Text>

      <View style={styles.inputContainer}>
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
      </View>

      <TouchableOpacity style={styles.button} onPress={deductMoney}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F5FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6739B7",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 15,
    borderColor: "#D1C4E9",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6739B7",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    shadowColor: "#6739B7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DeductMoneyScreen;