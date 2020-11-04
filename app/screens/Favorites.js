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
import Loading from "../components/Loading";
// configuración para firebase
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
// inicializamos base de datos
const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

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
      setReloadData(false);
    }, [userLogged, reloadData])
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

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (restaurants?.length === 0) {
    // retorna el componente creado
    return <NotFoundRestaurants />;
  }

  return (
    <View style={styles.viewBody}>
      {restaurants ? (
        <FlatList
          data={restaurants} // renderizamos el nuevo componente creado
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando restaurante" isVisible={isLoading} />
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

function UserNoLogged(props) {
  const { navigation } = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
        // navegación al stack account y a la screen login
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, setIsLoading, toastRef, setReloadData } = props;
  const { id, name, images } = restaurant.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Restaurante de Favoritos",
      "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    console.log("Removing..");
    setIsLoading(true);
    db.collection("favorites") // consulto favorites
      // condiciones
      .where("idRestaurant", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("Restaurante eliminado correctamente");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show("Error al eliminar el restaurante");
            });
        });
      });
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity onPress={() => console.log("IR")}>
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
