import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const API_URL = "http://192.168.1.102:5000"; // Change this to your backend URL

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/transaction/history`);
      if (response.data.success) {
        setTransactions(response.data.transactions);
      } else {
        setTransactions([]);
        Alert.alert("Error", "Failed to fetch transactions.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return transactions;
    return transactions.filter((txn) => txn.type === filterType);
  }, [transactions, filterType]);

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleString() : "N/A";
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.row}>
        <MaterialIcons
          name={item.type === "credit" ? "arrow-circle-up" : "arrow-circle-down"}
          size={30}
          color={item.type === "credit" ? "#34A853" : "#EA4335"}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionId}>{item.description || "Transaction"}</Text>
          <Text style={styles.transactionMeta}>Txn ID: {item.transactionId}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        <Text style={item.type === "credit" ? styles.creditAmount : styles.debitAmount}>
          {item.type === "credit" ? "+" : "-"}₹{item.amount}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Gradient Header */}
      <LinearGradient colors={["#4a148c", "#8e24aa"]} style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </LinearGradient>

      {/* ✅ Filter Buttons */}
      <View style={styles.filterContainer}>
        {["all", "credit", "debit"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filterType === type && styles.activeFilter]}
            onPress={() => setFilterType(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Transactions List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4a148c" />
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
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addMoneyButtonText}>Add Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#4a148c",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
  },
  transactionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 15,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionMeta: {
    fontSize: 12,
    color: "#555",
    fontStyle: "italic",
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
  creditAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34A853",
  },
  debitAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EA4335",
  },
  addMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a148c",
    paddingVertical: 12,
    borderRadius: 30,
    margin: 20,
    elevation: 4,
  },
  addMoneyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});

export default TransactionHistoryScreen;
