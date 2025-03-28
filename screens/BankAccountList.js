import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import axios from "axios";

const BankAccountsList = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://192.168.1.102:5000/bank/accounts");
        if (response.data.success) {
          setAccounts(response.data.accounts);
        } else {
          Alert.alert("Error", response.data.message || "Failed to fetch accounts.");
        }
      } catch (error) {
        Alert.alert("Error", error.response?.data?.message || "Could not fetch accounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleDelete = async (accountId) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await axios.delete(
              `http://192.168.1.102:5000/bank/delete/${accountId}`
            );
            if (response.data.success) {
              Alert.alert("Success", response.data.message);
              setAccounts(accounts.filter((account) => account._id !== accountId));
            } else {
              Alert.alert("Error", "Failed to delete the account.");
            }
          } catch (error) {
            Alert.alert("Error", "Could not delete account. Try again later.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bank Accounts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6739B7" />
      ) : accounts.length === 0 ? (
        <Text style={styles.noAccountText}>No bank accounts found.</Text>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.accountCard}>
              <Text style={styles.accountInfo}>Account Holder : {item.accountHolder}</Text>
              <Text style={styles.accountInfo}>Account Number : {item.accountNumber}</Text>
              <Text style={styles.accountInfo}>IFSC Code : {item.ifscCode}</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => navigation.navigate("HomeScreen", { selectedBankId: item._id })}
              >
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5FC",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#6739B7",
  },
  noAccountText: {
    fontSize: 18,
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  accountCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: "#6739B7",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BankAccountsList;
