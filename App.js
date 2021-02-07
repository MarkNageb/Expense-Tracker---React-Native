import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,SafeAreaView } from 'react-native';
import Login from "./screens/Login";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Home from "./screens/Home"


const Stack = createStackNavigator();



export default function App() {
  return (
   
    <NavigationContainer>
       <SafeAreaView style={styles.container}>
           <StatusBar style="light" />

           <Stack.Navigator>



              <Stack.Screen name="Login" component={Login} options={{headerShown:false}}  />
              <Stack.Screen name="Home" component={Home} options={{headerShown:false}}  />



           </Stack.Navigator>

    

       </SafeAreaView>
       </NavigationContainer>
    
     
   
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#121212",
    flex: 1,
  },
});
