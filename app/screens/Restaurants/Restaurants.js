import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import "firebase/firestore";
import firebase from "firebase/app";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";
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
  const [isLoading, setIsLoading] = useState(false);
  const limitRestaurants = 10;
  console.log(restaurants.length);
  // Ejecución al crearse el componente
  // seteo la info del usuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
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
    }, [setRestaurants])
  );

  const handleLoadMore = () => {
    const resultRestaurants = []; // array vacío de restaurantes
    // si length de restaurante es menor que total seteo carga a true
    restaurants.length < totalRestaurants && setIsLoading(true);

    db.collection("restaurants") //llamada a firebase
      .orderBy("createdAt", "desc")
      //empieza después del último restaurante
      .startAfter(startRestaurants.data().createdAt)
      .limit(limitRestaurants) // límite de 10 más
      .get()
      .then((response) => {
        //devuelve response
        if (response.docs.length > 0) {
          // si hay más restaurantes
          // guardamos el último restaurante para continuar por el siguiente
          setStartRestaurants(response.docs[response.docs.length - 1]);
        } else {
          // si entra aquí no hay más restaurantes que cargar
          setIsLoading(false); // seteamos el loading a false
        } // itero el response para sacar cada doc
        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id; // agrego el id al restaurante
          // agrego al array vacío los nuevos restaurantes
          resultRestaurants.push(restaurant);
        });
        // para unir los viejos restaurantes con los nuevos
        setRestaurants([...restaurants, ...resultRestaurants]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
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
