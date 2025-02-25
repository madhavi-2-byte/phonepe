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
import axios from "axios";

const CoinSelectionScreen = ({ navigation }) => {
  const [userBalance, setUserBalance] = useState(0); // Initially 0
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");

  const coinOptions = [50, 100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await axios.get("http://192.168.1.104:5000/user/balance");
      if (response.data.success) {
        setUserBalance(response.data.balance);
      } else {
        Alert.alert("Error", "Failed to fetch balance.");
      }
    } catch (error) {
      console.error("Balance fetch error:", error);
      Alert.alert("Error", "Could not fetch balance.");
    }
  };

  const handleCoinSelect = async (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(""); // Clear custom input
    await initiatePhonePePayment(amount);
  };

  const handleCustomAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
    setSelectedAmount(parseInt(numericValue) || 0);
  };

  const initiatePhonePePayment = async (amount) => {
    if (amount <= 0) {
      Alert.alert("Invalid Amount", "Please select or enter a valid amount.");
      return;
    }

    if (amount > userBalance) {
      Alert.alert("Insufficient Balance", "Please enter an amount within your balance.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.104:5000/payment/initiate", {
        amount,
      });

      if (response.data.success) {
        const { paymentUrl, transactionId } = response.data;

        if (await Linking.canOpenURL(paymentUrl)) {
          await Linking.openURL(paymentUrl);

          setTimeout(async () => {
            try {
              const statusResponse = await axios.get(
                `http://192.168.1.104:5000/payment/status/${transactionId}`
              );

              if (statusResponse.data.success && statusResponse.data.status === "SUCCESS") {
                setUserBalance((prevBalance) => prevBalance - amount);
                Alert.alert("Payment Successful", `₹${amount} has been deducted.`);
                fetchUserBalance(); // Fetch the updated balance
                setSelectedAmount(0);
                setCustomAmount("");
              } else {
                Alert.alert("Payment Failed", "Transaction was not successful.");
              }
            } catch (statusError) {
              console.error("Payment status error:", statusError);
              Alert.alert("Error", "Failed to verify payment status.");
            }
          }, 5000);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Money</Text>

      {/* Balance Card */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹{userBalance}</Text>
      </View>

      {/* Coin Selection */}
      <View style={styles.coinGrid}>
        {coinOptions.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.coinButton,
              selectedAmount === amount ? styles.selectedCoin : {},
            ]}
            onPress={() => handleCoinSelect(amount)}
          >
            <Text style={styles.coinText}>₹{amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount Input */}
      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        keyboardType="numeric"
        placeholder="Enter custom amount"
      />

      {/* Buy Now Button */}
      <TouchableOpacity
        style={[styles.buyButton, selectedAmount > 0 ? {} : styles.disabledButton]}
        onPress={() => initiatePhonePePayment(selectedAmount)}
        disabled={selectedAmount <= 0}
      >
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>

      {/* ✅ Add Bank Account Button */}
      <TouchableOpacity
        style={styles.bankButton}
        onPress={() => navigation.navigate("BankAccounts")}
      >
        <Text style={styles.bankButtonText}>Add Bank Account</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  coinText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  buyButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#2D9CDB",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bankButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#ff9800",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  bankButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CoinSelectionScreen;
