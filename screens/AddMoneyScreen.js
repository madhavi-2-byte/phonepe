import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Import Icons

const API_URL = "http://192.168.1.102:5000/api/wallet/add";

const AddMoneyScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const dispatch = useDispatch();

  const addMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0 || !accountNumber) {
      Alert.alert("Invalid Input", "Please enter a valid amount and account number.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        amount: parseFloat(amount),
        accountNumber,
      });

      if (response.data.success) {
        dispatch(setBalance(response.data.balance));
        Alert.alert("✅ Success", "Money added successfully.");
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
      <View style={styles.iconContainer}>
        <MaterialIcons name="account-balance-wallet" size={80} color="#6739B7" />
      </View>
      <Text style={styles.title}>Add Money</Text>

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

      <TouchableOpacity style={styles.button} onPress={addMoney}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F3F5FC",
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6739B7",
  },
  input: {
    width: "90%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#D1C4E9",
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#6739B7",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    shadowColor: "#6739B7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddMoneyScreen;
