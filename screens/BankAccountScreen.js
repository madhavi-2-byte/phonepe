import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BankAccounts = ({ navigation }) => {
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Check if all fields are filled
    if (!formData.accountHolder || !formData.accountNumber || !formData.ifscCode) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://192.168.1.104:5000/bank/add", // Make sure this is the correct backend URL
        formData // Send the form data directly
      );

      if (response.data.success) {
        // Show success message
        Alert.alert("Success", response.data.message);

        // Show the updated balance
        const updatedBalance = response.data.updatedBalance;
        Alert.alert("Your updated balance is", `₹${updatedBalance}`);

        // Store in AsyncStorage that the bank account has been added
        await AsyncStorage.setItem("hasBankAccount", "true");

        // Navigate to the HomeScreen or other appropriate screen
        navigation.replace("HomeScreen");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Error adding account");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get("http://192.168.1.104:5000/balance");
      if (response.data.success) {
        // Show balance
        const balance = response.data.balance;
        Alert.alert("Your balance is", `₹${balance}`);
      }
    } catch (error) {
      console.error("❌ Balance fetch error:", error);
      Alert.alert("Error", "Failed to fetch balance");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Bank Account</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Account Holder Name"
            value={formData.accountHolder}
            onChangeText={(text) => handleChange("accountHolder", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Account Number"
            value={formData.accountNumber}
            onChangeText={(text) => handleChange("accountNumber", text)}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChangeText={(text) => handleChange("ifscCode", text)}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add Account</Text>
            )}
          </TouchableOpacity>

          {/* Button to see all accounts */}
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("BankAccountsList")}
          >
            <Text style={styles.seeAllButtonText}>See All Accounts</Text>
          </TouchableOpacity>

          {/* Fetch Balance Button */}
          <TouchableOpacity
            style={styles.fetchBalanceButton}
            onPress={fetchBalance}
          >
            <Text style={styles.fetchBalanceButtonText}>Fetch Balance</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAllButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fetchBalanceButton: {
    backgroundColor: "#ffc107",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  fetchBalanceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BankAccounts;
