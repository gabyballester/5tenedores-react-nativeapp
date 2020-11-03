import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { size } from "lodash";
import Loading from "../components/Loading";
// configuración para firebase
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
// inicializamos base de datos
const db = firebase.firestore(firebaseApp);

export default function Favorites() {
  const [restaurants, setRestaurants] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  console.log(restaurants);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      // sólo se ejecuta si existe userlogged
      if (userLogged) {
        // traigo el iduser actual
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites") //ataco a favorites
          // donde el iduser coincida
          .where("idUser", "==", idUser)
          .get() // traigo resultados
          .then((response) => {
            // agrego array vacío de idsrestaurants
            const idRestaurantsArray = [];
            // finalizo promesa
            response.forEach((doc) => {
              // agrego los ids de restaurantes al array
              idRestaurantsArray.push(doc.data().idRestaurant);
            }); // llamo a getdatarestaurant y le paso el array
            // resuelvo promesa con then, devuelve response
            getDataRestaurant(idRestaurantsArray).then((response) => {
              const restuarants = []; // guardo datos de los restaurantes
              //recorro response
              response.forEach((doc) => {
                const restaurant = doc.data(); // creo constante con restaurant
                restaurant.id = doc.id; // asigno el id doc al restaurant
                restuarants.push(restaurant); // agrego restaurant a restaurants
              }); // al terminar setea restaurants con el array resultante
              setRestaurants(restuarants);
            });
          });
      }
    }, [userLogged])
  );

  const getDataRestaurant = (idRestaurantsArray) => {
    const arrayRestaurants = []; // array vacío para restaurantes
    // recorro el array devuelve cada id restaurant
    idRestaurantsArray.forEach((idRestaurant) => {
      // almacena cada restaurante en resultado
      const result = db.collection("restaurants").doc(idRestaurant).get();
      // rellena el array con result
      arrayRestaurants.push(result);
    }); // devuelvo el array al terminar el bucle con una promesa
    return Promise.all(arrayRestaurants);
  };

  if (!restaurants) {
    // si no existen restaurantes que muestre loading
    return <Loading isVisible={true} text="Cargando restaurantes.." />;
    // si existe y además existen restaurantes
  } else if (size(restaurants) === 0) {
    // retorna el componente creado
    return <NotFoundRestaurants />;
  }

  return (
    <View>
      <Text>Favorites</Text>
    </View>
  );
}

function NotFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restaurantes en tu lista
      </Text>
    </View>
  );
}
