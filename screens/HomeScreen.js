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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const API_URL = "http://192.168.1.102:5000"; // Replace with your backend URL

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

  return (
    <View style={styles.container}>
      {/* ✅ Gradient Header */}
     

      {/* ✅ Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Available Balance</Text>
        {loading ? <ActivityIndicator size="large" color="#7303c0" /> : <Text style={styles.balanceAmount}>₹{userBalance}</Text>}
      </View>

      {/* ✅ Navigation Buttons */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("AddMoneyScreen")}>
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.menuText}>Add Money</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("BankAccounts")}>
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.menuText}>Bank Accounts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("WalletScreen")}>
        <FontAwesome5 name="wallet" size={26} color="#fff" />
          <Text style={styles.menuText}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("DeductMoneyScreen")}>
          <FontAwesome5 name="wallet" size={26} color="#fff" />
          <Text style={styles.menuText}>Spend Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("TransactionHistoryScreen")}>
          <MaterialIcons name="history" size={28} color="#fff" />
          <Text style={styles.menuText}>Transactions</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Coin Selection */}
      <Text style={styles.sectionTitle}>Select Amount</Text>
      <View style={styles.coinGrid}>
        {[50, 100, 500, 1000, 2000, 5000].map((amount) => (
          <TouchableOpacity key={amount} style={[styles.coinButton, selectedAmount === amount && styles.selectedCoin]} onPress={() => handleCoinSelect(amount)}>
            <Text style={styles.coinText}>₹{amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Custom Amount Input */}
      <TextInput style={styles.input} value={customAmount} onChangeText={handleCustomAmountChange} keyboardType="numeric" placeholder="Enter custom amount" />

      {/* ✅ Buy Now Button */}
      <TouchableOpacity style={styles.buyButton} onPress={initiatePayment}>
        <Text style={styles.buyButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", alignItems: "center" },

  /** ✅ Gradient Header */
  header: { width: "100%", paddingVertical: 20, alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },

  /** ✅ Balance Card */
  balanceCard: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", alignItems: "center", elevation: 4, marginVertical: 15 },
  balanceText: { fontSize: 16, color: "#666" },
  balanceAmount: { fontSize: 28, fontWeight: "bold", color: "#7303c0" },

  /** ✅ Navigation Menu */
  menuContainer: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginVertical: 15 },
  menuButton: { flex: 1, backgroundColor: "#7303c0", padding: 15, borderRadius: 10, alignItems: "center", marginHorizontal: 5, elevation: 5 },
  menuText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginTop: 5 },

  /** ✅ Coin Selection */
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
  coinGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 10 },
  coinButton: { padding: 15, backgroundColor: "#e0e0e0", borderRadius: 10, margin: 5, minWidth: 80, alignItems: "center" },
  selectedCoin: { backgroundColor: "#7303c0" },
  coinText: { fontSize: 16, fontWeight: "bold", color: "#fff" },

  /** ✅ Buy Now Button */
  buyButton: { padding: 15, backgroundColor: "#7303c0", borderRadius: 10, alignItems: "center", width: "90%", marginTop: 20 },
  buyButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default HomeScreen;
