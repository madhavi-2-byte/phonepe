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

  // Fetch all bank accounts when the screen loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        console.log("🔹 Fetching from:", "http://192.168.1.116:5000/bank/accounts");
        const response = await axios.get("http://192.168.1.116:5000/bank/accounts");
  
        console.log("✅ Response:", response.data);
        if (response.data.success) {
          setAccounts(response.data.accounts);
        } else {
          Alert.alert("Error", response.data.message || "Failed to fetch accounts.");
        }
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        Alert.alert("Error", error.response?.data?.message || "Could not fetch accounts.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAccounts();
  }, []);
  // Handle delete account
  const handleDelete = async (accountId) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            console.log(`Deleting account with ID: ${accountId}`); 
            const response = await axios.delete(
              `http://192.168.1.116:5000/bank/delete/${accountId}`
            );

            if (response.data.success) {
              Alert.alert("Success", response.data.message);
              setAccounts(accounts.filter((account) => account._id !== accountId));
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

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : accounts.length === 0 ? (
        <Text style={styles.noAccountText}>No bank accounts found.</Text>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.accountCard}>
              <Text style={styles.accountInfo}>Account Holder: {item.accountHolder}</Text>
              <Text style={styles.accountInfo}>Account Number: {item.accountNumber}</Text>
              <Text style={styles.accountInfo}>IFSC Code: {item.ifscCode}</Text>

              {/* Select Bank and Navigate to HomeScreen */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  console.log("Navigating with Bank ID:", item._id);
                  navigation.navigate("HomeScreen", { selectedBankId: item._id });
                }}
              >
                <Text style={styles.viewButtonText}>Select</Text>
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
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
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
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 8,
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
