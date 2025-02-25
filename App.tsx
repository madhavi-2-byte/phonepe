import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Correct the import paths based on where your files are located in the project structure
import BankAccounts from './screens/BankAccountScreen'; // Ensure the path is correct
import BankAccountList from './screens/BankAccountList'; // Ensure the path is correct
import HomeScreen from './screens/HomeScreen'; // Ensure the path is correct

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BankAccounts">
        <Stack.Screen name="BankAccounts" component={BankAccounts} />
        <Stack.Screen name="BankAccountsList" component={BankAccountList} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
