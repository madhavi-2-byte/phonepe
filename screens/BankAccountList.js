import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BankAccountsList = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bank accounts when the screen loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://192.168.1.112:5000/bank/accounts");

        if (response.data.success) {
          setAccounts(response.data.accounts);
        } else {
          Alert.alert("Error", "Failed to fetch accounts.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        Alert.alert("Error", "Could not fetch accounts. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigation]);

  // Handle delete account
  const handleDelete = async (accountId) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this account?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log(`Deleting account with ID: ${accountId}`); // Log the accountId
            const response = await axios.delete(
              `http://192.168.1.112:5000/bank/delete/${accountId}` // Update the URL here
            );
  
            if (response.data.success) {
              Alert.alert("Success", response.data.message);
              setAccounts(accounts.filter((account) => account._id !== accountId)); // Remove the deleted account from the list
            } else {
              Alert.alert("Error", "Failed to delete the account.");
            }
          } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert("Error", "Could not delete account. Try again later.");
          }
        },
      },
    ]);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bank Accounts</Text>

      {/* Add New Bank Account Button */}
      

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.accountCard}>
              <Text style={styles.accountInfo}>Account Holder: {item.accountHolder}</Text>
              <Text style={styles.accountInfo}>Account Number: {item.accountNumber}</Text>
              <Text style={styles.accountInfo}>IFSC Code: {item.ifscCode}</Text>

              {/* Navigate to account details */}
              <TouchableOpacity
                
                onPress={() => navigation.navigate("BankAccountDetails", { accountId: item._id })}
              >
               
              </TouchableOpacity>

              {/* Delete Account */}
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
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  accountCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BankAccountsList;