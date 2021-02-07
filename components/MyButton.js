import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

function MyButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 40,
    backgroundColor: "#78c2ad",
    borderRadius:20,
    marginTop:40,
    marginBottom:10,
    textAlign:"center",
    justifyContent:"center",
    alignItems:"center",
    
  },
  text:{
    fontSize:20
  }
});

export default MyButton;
