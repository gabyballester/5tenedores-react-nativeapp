import React, { useRef, useState, useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";
//importaciones de firebase
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
// constante con db
const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();
  console.log("Listado de restaurantes");
  console.log(restaurants);

  useEffect(() => {
    db.collection("restaurants") // llamada a restaurants
      .orderBy("rating", "desc") //ordenado por rating
      .limit(5) //limite 5
      .get() // traer datos
      //resuelvo promesa
      .then((response) => {
        const restaurantArray = []; // Agrego array vacío
        // recorro response
        response.forEach((doc) => {
          const data = doc.data(); // guardo data en data
          data.id = doc.id; // asigno el id doc al id data
          restaurantArray.push(data); // voy rellenando el array con data
        });
        setRestaurants(restaurantArray); // actualizo estado de restaurants
      });
  }, []);

  return (
    <View>
      <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}
