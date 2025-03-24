import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // "all", "credit", "debit", "credit-debit"
  const API_URL = "http://192.168.1.116:5000";
  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching transactions from:", `${API_URL}/transaction/history`);
      
      const response = await axios.get(`${API_URL}/transaction/history`);
      console.log("✅ API Response:", response.data);
  
      if (response.data.success) {
        setTransactions(response.data.transactions);
      } else {
        setTransactions([]);
        Alert.alert("Error", "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("❌ API Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Auto-refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  // ✅ Optimized Filtering using useMemo
  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return transactions;
    if (filterType === "credit-debit")
      return transactions.filter((txn) => txn.type === "credit" || txn.type === "debit");
    return transactions.filter((txn) => txn.type === filterType);
  }, [transactions, filterType]);

  // ✅ Render Transaction Item
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionId}>Txn ID: {item.transactionId}</Text>
      <Text style={item.type === "credit" ? styles.creditAmount : styles.debitAmount}>
        {item.type === "credit" ? "+" : "-"}₹{item.amount}
      </Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      {/* ✅ Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === "all" && styles.activeFilter]}
          onPress={() => setFilterType("all")}
        >
          <Text style={[styles.filterText, filterType === "all" && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === "credit" && styles.activeFilter]}
          onPress={() => setFilterType("credit")}
        >
          <Text style={[styles.filterText, filterType === "credit" && styles.activeFilterText]}>Credits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === "debit" && styles.activeFilter]}
          onPress={() => setFilterType("debit")}
        >
          <Text style={[styles.filterText, filterType === "debit" && styles.activeFilterText]}>Debits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === "credit-debit" && styles.activeFilter]}
          onPress={() => setFilterType("credit-debit")}
        >
          <Text style={[styles.filterText, filterType === "credit-debit" && styles.activeFilterText]}>
            Credits & Debits
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Show Transactions or Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#2D9CDB" />
      ) : filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.transactionId}
          renderItem={renderTransaction}
        />
      ) : (
        <Text style={styles.emptyText}>No transactions found.</Text>
      )}

      {/* ✅ Add Money Button */}
      <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("AddMoneyScreen")}>
        <Text style={styles.addMoneyButtonText}>Add Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  transactionItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionId: {
    fontSize: 16,
    color: "#333",
  },
  creditAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  debitAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  addMoneyButton: {
    marginTop: 20,
    backgroundColor: "#2D9CDB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addMoneyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#2D9CDB",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});

export default TransactionHistoryScreen;
