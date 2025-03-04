import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store"; // Import Redux store
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import OtpRequestScreen from "./screens/OtpRequestScreen";
import VerifyOTP from "./screens/VerifyOtp";
import CreatePasswordScreen from "./screens/PasswordScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import BankAccounts from "./screens/BankAccountScreen";
import BankAccountList from "./screens/BankAccountList";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>  
      <NavigationContainer>
      <Stack.Navigator initialRouteName="OtpRequest">
        <Stack.Screen name="OtpRequest" component={OtpRequestScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
          <Stack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="BankAccounts" component={BankAccounts} />
          <Stack.Screen name="BankAccountsList" component={BankAccountList} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
