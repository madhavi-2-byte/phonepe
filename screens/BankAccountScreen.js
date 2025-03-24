import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from "react-native";

const BankAccountScreen = ({ navigation }) => {
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const handleAddBankAccount = async () => {
    if (!accountHolder || !accountNumber || !ifscCode) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
  
    try {
      const response = await fetch("http://192.168.1.116:5000/bank/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountHolder, accountNumber, ifscCode }),
      });
  
      // Log the full response text
      const responseText = await response.text();
      console.log("Server Response:", responseText);
  
      // Try to parse the response
      const data = JSON.parse(responseText);
  
      if (data.success && data.account) {
        Alert.alert("Success", "Bank account added successfully!");
        navigation.navigate("HomeScreen", { selectedBankId: data.account._id });
      } else {
        Alert.alert("Error", data.message || "Failed to add bank account.");
      }
  
    } catch (error) {
      console.error("Error adding bank account:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Bank Account</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Account Holder Name" 
        onChangeText={setAccountHolder} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Account Number" 
        keyboardType="numeric" 
        onChangeText={setAccountNumber} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="IFSC Code" 
        onChangeText={setIfscCode} 
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBankAccount}>
        <Text style={styles.addButtonText}>Save & Continue</Text>
      </TouchableOpacity>

      {/* ✅ See All Accounts Button */}
      <TouchableOpacity 
        style={styles.seeAccountsButton} 
        onPress={() => navigation.navigate("BankAccountsList")}
      >
        <Text style={styles.seeAccountsButtonText}>See All Accounts</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Updated Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fd" },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 15 },
  input: { width: "100%", padding: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, marginBottom: 10 },
  addButton: { width: "100%", paddingVertical: 15, backgroundColor: "#2D9CDB", alignItems: "center", borderRadius: 10 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  seeAccountsButton: { width: "100%", paddingVertical: 15, backgroundColor: "#ff9800", alignItems: "center", borderRadius: 10, marginTop: 10 },
  seeAccountsButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default BankAccountScreen;
