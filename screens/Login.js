import { Formik } from "formik";
import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import MyButton from "../components/MyButton";
import axios from "axios";
import { URL } from "../global";
import Spinner from "react-native-loading-spinner-overlay";
import Modal from "react-native-modalbox";
import CheckBox from "react-native-check-box";
import * as yup from "yup";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import User from "../User";

const loginSchema = yup.object({});

function Login({navigation}) {
  
  const [loginErrors, setLoginErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const renderModal = () => {
    return (
      <Modal
        backdropPressToClose={true}
        style={styles.modal}
        backdropColor="black"
        hasBackdrop={true}
        isOpen={modalOpen}
        backdropOpacity={0.8}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Error Logging in:</Text>
          {loginErrors.map((err) => {
            return <Text style={styles.modalText}>{err}</Text>;
          })}
          <Button
            title="Close"
            onPress={() => {
              setLoginErrors([]);
              setModalOpen(false);
            }}
          />
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={loginSchema}
        initialValues={{ email: "", password: "", toggle: false }}
        onSubmit={(values, actions) => {
          setLoading(true);
          axios
            .post(URL + "/logging/login", {
              email: values.email,
              password: values.password,
            })
            .then((res) => {
              
              
              User.token=res.headers["auth-token"]
              User.email=res.data.email
              User.expenses=res.data.expenses;
              User.expesesCategories=res.data.expesesCategories;
              User.income=res.data.income;
              User.incomeCategories=res.data.incomeCategories;
            

              navigation.navigate("Home")
             // console.log(res.data);
              
            })
            .catch((error) => {
              if (error.response) {
                let errs = [];
                const res = error.response;
                console.log(res.status);
                console.log(res.data);
                if (res.status === 400) {
                  for (let i = 0; i < res.data.length; i++) {
                    let err = res.data[i];
                    errs.push(err.msg);
                  }
                  console.log(errs);
                } else {
                  if (res.status === 401) {
                    errs = [res.data.msg];
                  }
                }

                setLoginErrors(errs);
              } else {
                console.log(error.message);
                console.log(error);
              }
            })
            .finally(() => {
              setLoading(false);
              setModalOpen(true);
            });
        }}
      >
        {(props) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.form}>
                <Spinner visible={loading} />
                <Text style={styles.title}>Expen$e Tracker</Text>
                <Text style={styles.text}>Log In</Text>
                {renderModal()}

                <View style={styles.inputContainer}>
                <MaterialIcons name="email" color="#fff" size={20}/>
                <TextInput
                  keyboardType="email-address"
                  placeholderTextColor="gray"
                  style={styles.formInput}
                  placeholder="E-mail"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                />
                </View>

                <View style={styles.inputContainer}>
                <MaterialIcons name="vpn-key" color="#fff" size={20}/>
                <TextInput
                  placeholderTextColor="gray"
                  style={styles.formInput}
                  placeholder="Password"
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                />
                </View>

                <MyButton title={"Submit"} onPress={props.handleSubmit} />

                <Text style={styles.signUpText}> Don't have an account? Sign up</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    color: "white",
    flex: 1,
  },
  signUpText:{
    marginTop:30,
    fontSize:15,
    color:"white",
    borderBottomColor:"white",
    borderBottomWidth:3,
  },
  form: {
    color: "white",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 35,
    marginBottom: 60,
  },
  inputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderBottomWidth:1,
    borderBottomColor:"white"
  },  
  formInput: {
    color: "white",
    width: 250,
    height: 40,
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  modalContent: {
    color: "white",
  },
  modal: {
    backgroundColor: "rgb(80,80,80)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
    maxHeight: 200,
    width: 300,
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 20,
  },
  modalText: {
    color: "#CF6679",
    marginVertical: 5,
  },

});

export default Login;
