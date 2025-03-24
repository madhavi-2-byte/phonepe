import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setBalance } from "../redux/slices/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://192.168.1.116:5000"; // Replace with your backend URL

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userBalance = useSelector((state) => state.wallet.balance);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState({ accountNumber: "", ifsc: "" });

  useEffect(() => {
    fetchBalance();
    const socket = io(API_URL);
    socket.on("balanceUpdate", async (newBalance) => {
      dispatch(setBalance(newBalance));
      await AsyncStorage.setItem("userBalance", JSON.stringify(newBalance));
    });
    return () => socket.disconnect();
  }, []);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/bank/account-balance`, {
        params: { accountNumber: "1234567890" },
      });
      if (response.data.success) {
        dispatch(setBalance(response.data.balance));
        await AsyncStorage.setItem("userBalance", JSON.stringify(response.data.balance));
      }
    } catch (err) {
      console.error("❌ Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoinSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
    setSelectedAmount(parseInt(numericValue) || 0);
  };

  const initiatePayment = () => {
    if (!selectedAmount || selectedAmount <= 0) {
      Alert.alert("Error", "Please select a valid amount.");
      return;
    }

    Alert.alert("Select Payment Method", "Choose your preferred payment method", [
      { text: "UPI", onPress: () => openModal("UPI") },
      { text: "Bank Account", onPress: () => openModal("BANK") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openModal = (method) => {
    setPaymentMethod(method);
    setModalVisible(true);
  };

  const processPayment = async () => {
    if (paymentMethod === "UPI" && !upiId.trim()) {
      Alert.alert("Error", "Please enter a valid UPI ID.");
      return;
    }

    if (paymentMethod === "BANK" && (!bankAccount.accountNumber.trim() || !bankAccount.ifsc.trim())) {
      Alert.alert("Error", "Please enter both Account Number and IFSC Code.");
      return;
    }

    setModalVisible(false);

    try {
      const payload = {
        amount: selectedAmount,
        paymentMethod,
        ...(paymentMethod === "UPI" ? { upiId } : { bankAccount }),
      };

      console.log("📡 Sending Payment Request:", payload);

      const response = await axios.post(`${API_URL}/api/initiate-payment`, payload);

      console.log("✅ Payment Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment initiation failed.");
      }

      if (response.data.paymentUrl) {
        console.log("🔗 Redirecting to:", response.data.paymentUrl);
        const supported = await Linking.canOpenURL(response.data.paymentUrl);
        if (supported) {
          Linking.openURL(response.data.paymentUrl);
        } else {
          Alert.alert("Error", "Cannot open PhonePe link.");
        }
      } else {
        Alert.alert("Success", "Bank transfer initiated successfully.");
      }
    } catch (err) {
      console.error(`🔴 Error initiating ${paymentMethod} payment:`, err);
      Alert.alert("Error", `Payment failed: ${err.message}`);
    }
  };

  
  
  
  return (
    <View style={styles.container}>
      {/* Wallet Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Available Balance</Text>
        {loading ? <ActivityIndicator size="large" color="#2D9CDB" /> : <Text style={styles.balanceAmount}>₹{userBalance}</Text>}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("WalletScreen")}>
    <Text style={styles.buttonText}>Wallet</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("AddMoneyScreen")}>
    <Text style={styles.buttonText}>Add Money</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("DeductMoneyScreen")}>
    <Text style={styles.buttonText}>Deduct Money</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate("TransactionHistoryScreen")}>
    <Text style={styles.buttonText}>Transaction History</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.bankButton} onPress={() => navigation.navigate("BankAccounts")}>
    <Text style={styles.buttonText}>Add Bank Account</Text>
  </TouchableOpacity>
</View>
      {/* Coin Selection */}
      <View style={styles.coinGrid}>
        {[50, 100, 500, 1000, 2000, 5000].map((amount) => (
          <TouchableOpacity key={amount} style={[styles.coinButton, selectedAmount === amount && styles.selectedCoin]} onPress={() => handleCoinSelect(amount)}>
            <Text style={styles.coinText}>₹{amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount Input */}
      <TextInput style={styles.input} value={customAmount} onChangeText={handleCustomAmountChange} keyboardType="numeric" placeholder="Enter custom amount" />

      {/* Buy Now Button */}
      <TouchableOpacity style={styles.buyButton} onPress={initiatePayment}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>

      {/* Payment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{paymentMethod === "UPI" ? "Enter UPI ID" : "Enter Bank Details"}</Text>
            {paymentMethod === "UPI" ? (
              <TextInput style={styles.modalInput} placeholder="Enter UPI ID" value={upiId} onChangeText={setUpiId} keyboardType="email-address" />
            ) : (
              <>
                <TextInput style={styles.modalInput} placeholder="Account Number" keyboardType="numeric" value={bankAccount.accountNumber} onChangeText={(text) => setBankAccount({ ...bankAccount, accountNumber: text })} />
                <TextInput style={styles.modalInput} placeholder="IFSC Code" value={bankAccount.ifsc} onChangeText={(text) => setBankAccount({ ...bankAccount, ifsc: text })} />
              </>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={processPayment}>
              <Text style={styles.modalButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f4f4f4", 
    alignItems: "center" 
  },

  /** ✅ Wallet Balance Styles */
  balanceContainer: { 
    width: "90%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  balanceText: { 
    fontSize: 18, 
    color: "#666" 
  },
  balanceAmount: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#2D9CDB" 
  },

    /** ✅ Button Container */
    buttonContainer: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      width: "90%", 
      marginVertical: 20, 
    },
  
    /** ✅ Add Money Button */
    addMoneyButton: { 
      flex: 1, 
      backgroundColor: "#2D9CDB", 
      paddingVertical: 15, 
      borderRadius: 10, 
      alignItems: "center", 
      marginHorizontal: 5, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 3 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 4, 
      elevation: 5, 
    },
  
    /** ✅ Transaction History Button */
    historyButton: { 
      flex: 1, 
      backgroundColor: "#4CAF50", 
      paddingVertical: 15, 
      borderRadius: 10, 
      alignItems: "center", 
      marginHorizontal: 5, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 3 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 4, 
      elevation: 5, 
    },
  
    /** ✅ Add Bank Account Button */
    bankButton: { 
      flex: 1, 
      backgroundColor: "#FF9800", 
      paddingVertical: 15, 
      borderRadius: 10, 
      alignItems: "center", 
      marginHorizontal: 5, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 3 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 4, 
      elevation: 5, 
    },
  
    /** ✅ Button Text (for all buttons) */
    buttonText: { 
      color: "#fff", 
      fontSize: 16, 
      fontWeight: "bold", 
    },


  /** ✅ Coin Selection Styles */
  coinGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    marginVertical: 15 
  },
  coinButton: { 
    padding: 15, 
    backgroundColor: "#e0e0e0", 
    borderRadius: 10, 
    margin: 5, 
    minWidth: 80, 
    alignItems: "center" 
  },
  selectedCoin: { 
    backgroundColor: "#2D9CDB" 
  },
  coinText: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },

  /** ✅ Custom Amount Input */
  input: { 
    width: "90%", 
    padding: 15, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    marginTop: 10, 
    textAlign: "center" 
  },

  /** ✅ Buy Now Button */
  buyButton: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: "#2D9CDB", 
    borderRadius: 10, 
    alignItems: "center", 
    width: "90%" 
  },
  buyButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  /** ✅ Payment Modal Styles */
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContainer: { 
    width: "90%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 12, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },

  /** ✅ Close Button */
  closeButton: { 
    alignSelf: "flex-end", 
    backgroundColor: "#FF4444", 
    padding: 5, 
    borderRadius: 20 
  },
  closeButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  /** ✅ Modal Title */
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginVertical: 10, 
    color: "#333" 
  },

  /** ✅ Modal Input Fields */
  modalInput: { 
    width: "100%", 
    padding: 15, 
    backgroundColor: "#f8f8f8", 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 10, 
    marginBottom: 10, 
    fontSize: 16, 
    textAlign: "center" 
  },

  /** ✅ Modal Proceed Button */
  modalButton: { 
    marginTop: 10, 
    paddingVertical: 12, 
    width: "100%", 
    backgroundColor: "#2D9CDB", 
    borderRadius: 8, 
    alignItems: "center" 
  },
  modalButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});


export default HomeScreen;
