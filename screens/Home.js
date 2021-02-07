import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../global";
import Pie from "react-native-pie";
const moment = require("moment");
import User from "../User";
import { set } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-svg-charts";
import { Use } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function genPieData(arr) {
 
  let data = arr;
 
  const pieArray = data.map((value, index) => ({
    value: value[1],
    svg: {
      fill: pieColors[index],
      onPress: () => console.log("press", index),
    },
    arc: {
      cornerRadius: 5,
    },
    key: `pie-${index}`,
  }));
  
  return pieArray;
}
const pieColors = ["#9829EC", "#FD8450", "#362352", "#4326BD"];
function calculateTopCategories(arr) {
  const output = {};
  for (let i = 0; i < arr.length; i++) {
    let curE = arr[i];
    if (output[curE.category]) {
      output[curE.category] = output[curE.category] + curE.amount;
    } else {
      output[curE.category] = curE.amount;
    }
  }
  var sortable = [];
  for (var category in output) {
    sortable.push([category, output[category]]);
  }
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  if (sortable.length > 3) {
    let top = [];
    top.push(sortable[0]);
    top.push(sortable[1]);
    top.push(sortable[2]);
    let other = 0;
    for (let i = 3; i < sortable.length; i++) {
      console.log("ddd");
      other += sortable[i][1];
    }

    top.push(["others", other]);
    console.log("EEEEE:  ");
    console.log("top");
    return top;
  }

  
  return sortable;
}

function Home({ navigation }) {
  const calculateForMonth = (arr, month) => {
    let curMonth = month;

    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      let curE = arr[i];
      let date = curE.date;
      let dateMonth = moment(date).format("MMMM");

      if (dateMonth === curMonth) {
        sum = sum + curE.amount;
      }
    }
    return sum;
  };
  const [income, setIncome] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expesesCategories, setExpensesCategories] = useState([]);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [topCategory, setTopCategory] = useState(
    calculateTopCategories(User.expenses)
  );
  const [pieData, setPieData] = useState(genPieData(topCategory));
  const [onExpense, setOnExpense] = useState(true);

  useEffect(() => {
    if (!User.token) {
      console.log("ROUTED TO HOME");
      navigation.navigate("Login");
    }
    setIncome(User.income);
    setIncomeCategories(User.incomeCategories);
    setExpenses(User.expenses);
    setExpensesCategories(User.expesesCategories);
    setMonthExpense(calculateForMonth(User.expenses, moment().format("MMMM")));
    setMonthIncome(calculateForMonth(User.income, moment().format("MMMM")));
   
  }, []);
  const changeCat=(flag)=>{
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.month}>{moment().format("MMMM")}</Text>

        <Text
          style={{
            ...styles.month,
            color:
              monthIncome - monthExpense < 0
                ? globalStyles.minusColor
                : globalStyles.plusColor,
          }}
        >
          {(monthIncome - monthExpense).toFixed(2)} $
        </Text>
      </View>
      <View style={styles.add}>
        <TouchableOpacity style={styles.addExpense}>
          <Text style={styles.addText}>Add Expense</Text>
          <MaterialIcons
            size={18}
            name="add-circle-outline"
            color="rgb(255,80,80)"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addIncome}>
          <Text style={styles.addText}>Add Income</Text>
          <MaterialIcons size={18} name="add-circle-outline" color="green" />
        </TouchableOpacity>
      </View>

      <PieChart
        style={{ width: 200, height: 200, marginVertical: 10 }}
        data={pieData}
        padAngle={0.04}
        innerRadius="65%"
      />

      <View style={styles.lists}>
        <TouchableOpacity

          style={{
            ...styles.wrapCat,
            borderBottomColor: onExpense ? "#9829EC" : "gray",
          }}
        >
          <Text
            style={{
              ...styles.catTitle,
              color: onExpense ? "#9829EC" : "gray",
              
            }}
          >
            Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.wrapCat,
            borderBottomColor: !onExpense ? "#9829EC" : "gray",
          }}
        >
          <Text
            style={{
              ...styles.catTitle,
              color: !onExpense ? "#9829EC" : "gray",
             
            }}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {topCategory.map((val,i)=>{
          return(
            <View key={i} style={styles.listItem}>
              <View style={{alignItems:"center", flex:1,flexDirection:"row"}}>
              <View style={{borderRadius:"50%", width:30,height:30,backgroundColor:pieColors[i]}}></View>
               <Text style={styles.itemText}>{val[0]}</Text>
               </View>
               <Text style={{...styles.itemText,...styles.itemAmount}}>$ {val[1]}</Text>
              </View>
           
          )
        })}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: windowWidth - 40,
    backgroundColor: globalStyles.elevation,
    borderRadius: 10,

    paddingVertical: 10,
    marginBottom: 7,
  },
  month: {
    margin: 10,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  add: {
    color: "white",
    width: windowWidth - 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  addExpense: {
    color: "white",
    borderRadius: globalStyles.radius,
    marginVertical: 10,
    padding: 7,
    marginLeft: 0,
    marginRight: 10,
    backgroundColor: globalStyles.elevation,
    alignItems: "center",
    flex: 1,
  },
  addIncome: {
    borderRadius: globalStyles.radius,
    marginVertical: 10,
    padding: 7,
    marginRight: 0,
    backgroundColor: globalStyles.elevation,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  addText: {
    color: "white",
    marginBottom: 10,
    fontSize: 15,
  },
  lists: {
    flexDirection: "row",
    marginTop: 10,
    width: windowWidth - 40,
    justifyContent: "space-around",
  },
  wrapCat: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  catTitle: {
    flex: 1,
    textAlign: "center",

    padding: 10,
    fontSize: 20,
    color: "white",
  },
  listContainer:{
    marginTop:10,
    flex:1,
    width:windowWidth-40,
  },
  listItem:{
  
    flexDirection:"row",
    color:"white",
   justifyContent:"center",
   alignItems:"center",

   marginVertical:10,
   paddingVertical:10,
  },
  itemText:{
    textTransform:"capitalize",
    marginLeft:10,
    fontSize:20,
    color:"white",
  },
  itemAmount:{
    color:"white",
 
  alignSelf:"flex-end",


  }
});

export default Home;
