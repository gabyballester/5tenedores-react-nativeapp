import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
//constante db
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  //manejo del estado local del usuario
  const [user, setUser] = useState(null);
  // estado para almacenar los restaurantes (array vacío)
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const limitRestaurants = 10;
  console.log(restaurants);
  
  // Ejecución al crearse el componente
  // seteo la info del usuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then((snap) => {
        setTotalRestaurants(snap.size);
      });

    const resultRestaurants = [];

    db.collection("restaurants")
      .orderBy("createdAt", "desc")
      .limit(limitRestaurants)
      .get()
      .then((response) => {
        setStartRestaurants(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          //recorro los restaurantes
          const restaurant = doc.data();
          restaurant.id = doc.id; // seteo el id
          resultRestaurants.push(restaurant); //rellenamos array
        }); //seteo los nuevos restaurantes con el array resultante
        setRestaurants(resultRestaurants);
      });
  }, []);

  return (
    <View style={styles.viewBody}>
      <Text>Restaurants...</Text>
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-restaurant")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
