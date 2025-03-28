import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet 
} from "react-native";
import axios from "axios";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const API_URL = "http://192.168.1.102:5000"; // Change this to your backend URL

const CreatePasswordScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    
    if (!phone) {
      newErrors.phone = "Phone number is required!";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number!";
    }

    if (!password) {
      newErrors.password = "Password is required!";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password!";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePassword = async () => {
    if (!validateFields()) return;

    try {
      console.log("📡 Sending request to:", `${API_URL}/user/create-password`);
      const response = await axios.post(`${API_URL}/user/create-password`, {
        phone,
        password,
      });

      if (!response.data.success) {
        Alert.alert("⚠️ Error", response.data.message);
        return;
      }

      Alert.alert("✅ Success", "Password created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      Alert.alert("⚠️ Error", "Something went wrong. Check your network & backend.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={26} color="#fff" />
      </TouchableOpacity>

      {/* ✅ Card Layout */}
      <View style={styles.card}>
        {/* ✅ Lock Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="lock" size={80} color="#fff" />
        </View>

        <Text style={styles.title}>Secure Your Account</Text>
        <Text style={styles.subtitle}>Create a strong password for security</Text>

        {/* ✅ Input Fields */}
        <View style={styles.form}>
          {/* Phone Input */}
          <View style={styles.inputContainer(errors.phone)}>
            <MaterialIcons name="phone" size={24} color="#4a148c" />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors({ ...errors, phone: "" });
              }}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer(errors.password)}>
            <MaterialIcons name="lock-outline" size={24} color="#4a148c" />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#4a148c" 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <View style={styles.inputContainer(errors.confirmPassword)}>
            <MaterialIcons name="lock" size={24} color="#4a148c" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: "" });
              }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons 
                name={showConfirmPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#4a148c" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {/* ✅ Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleCreatePassword}>
            <Text style={styles.buttonText}>Create Password</Text>
          </TouchableOpacity>

          {/* ✅ Already Have an Account? Login */}
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#4a148c",
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: (error) => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 1.5,
    borderColor: error ? "#FF4D4D" : "#4a148c",
    marginBottom: 5,
  }),
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4a148c",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    color: "#4a148c",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default CreatePasswordScreen;
