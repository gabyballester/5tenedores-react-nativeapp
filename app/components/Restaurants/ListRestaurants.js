// rnfs: crea un componente de react native
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { size } from "lodash";

import { Image } from "react-native-elements";

export default function ListRestaurants(props) {
  const { restaurants } = props;

  return (
    <View style={styles.loaderRestaurants}>
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => <Restaurant restaurant={restaurant} />}
          keyExtractor={(item, index)=>index.toString()}
        />
      ) : (
        <View>
          <ActivityIndicator color="#00a680" />
          <Text>Cargando restaurantes..</Text>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurants } = props;

  return (
    <View>
      <Text>Restaurante</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});
