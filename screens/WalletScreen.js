import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons"; 

const WalletScreen = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [balance, setBalance] = useState(5000); // Sample balance
  const transactions = [
    { id: "1", type: "credit", amount: 2000, status: "Success", icon: "arrow-downward", color: "#4CAF50" },
    { id: "2", type: "debit", amount: 500, status: "Pending", icon: "arrow-upward", color: "#FF9800" },
    { id: "3", type: "debit", amount: 1200, status: "Failed", icon: "cancel", color: "#F44336" },
  ];

  return (
    <View style={styles.container}>
      {/* ✅ Wallet Balance Section */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? `₹${balance}` : "******"}
          </Text>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            <Ionicons 
              name={balanceVisible ? "eye-off" : "eye"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Quick Actions Grid */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="money-bill-wave" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Send Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Entypo name="wallet" size={24} color="#3F51B5" />
          <Text style={styles.actionText}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="receipt" size={24} color="#FF9800" />
          <Text style={styles.actionText}>Pay Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="history" size={24} color="#E91E63" />
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Transaction History */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <ScrollView>
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.transactionItem}>
            <MaterialIcons name={txn.icon} size={24} color={txn.color} />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionText}>
                {txn.type === "credit" ? "Added Money" : "Payment"}
              </Text>
              <Text style={[styles.status, { color: txn.color }]}>{txn.status}</Text>
            </View>
            <Text style={styles.amount}>
              {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  balanceCard: {
    backgroundColor: "#673AB7",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  balanceRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  balanceAmount: { color: "#fff", fontSize: 28, fontWeight: "bold", marginRight: 10 },
  quickActions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  actionButton: { 
    width: "48%", 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    alignItems: "center",
    marginVertical: 5,
    elevation: 3, 
  },
  actionText: { marginTop: 5, fontSize: 14, fontWeight: "bold", color: "#333" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  transactionDetails: { flex: 1, marginLeft: 10 },
  transactionText: { fontSize: 16, fontWeight: "bold" },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 3 },
});

export default WalletScreen;
