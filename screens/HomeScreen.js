import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const noteAmounts = [100, 200, 500, 1000];

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const onPressAmount = (amount) => {
    navigation.navigate('Payment', { amount });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.amountBox, isDarkMode && styles.darkAmountBox]}
      onPress={() => onPressAmount(item)}
    >
      <Ionicons name="cash-outline" size={24} color={isDarkMode ? '#fff' : '#fff'} />
      <Text style={[styles.amountText, isDarkMode && styles.darkAmountText]}>₹{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Profile Header */}
      {/* Profile Header with User Icon */}
      <View style={styles.header}>
        <View style={styles.userIcon}>
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={[styles.userName, isDarkMode && styles.darkText]}>Hello, User</Text>
      </View>
      {/* Main Content */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Select Payment Amount
        </Text>
        <FlatList
          data={noteAmounts}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6', // Light Purple Background
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkContainer: {
    backgroundColor: '#1C0C5B', // Dark Purple Background
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#5404EB', // PhonePe Purple
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  darkText: {
    color: '#EDE7F6',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  darkCard: {
    backgroundColor: '#2D1674', // Darker shade for contrast
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5404EB',
  },
  listContainer: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    width: '100%',
  },
  amountBox: {
    backgroundColor: '#5404EB', // PhonePe Primary Color
    width: '45%',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 5,
  },
  darkAmountBox: {
    backgroundColor: '#9B66FF', // Lighter shade of Purple in Dark Mode
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  darkAmountText: {
    color: '#EDE7F6',
  },
});
