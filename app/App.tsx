import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './(auth)/login'; // Adjust according to your structure
import RegisterScreen from './(auth)/register'; // Ensure this is the correct path
import homescreen from './(tabs)/homescreen';
 // Ensure this is the correct path

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={homescreen} /> {/* Make sure this line is present */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
