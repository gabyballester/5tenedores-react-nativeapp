import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";
import Modal from "../Modal";

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);

  const addRestaurant = () => {
    console.log("Apretado");
    console.log("restaurantName: " + restaurantName);
    console.log("restaurantAddress: " + restaurantAddress);
    console.log("restaurantDescription: " + restaurantDescription);
  };
  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} />
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMap
  } = props;
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: "#c2c2c2",
          onPress: () =>setIsVisibleMap(true)
        }}
      />
      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setIsVisibleMap } = props;
  return (
      <Modal isVisible= {isVisibleMap} setIsVisible={setIsVisibleMap}>
          <Text>Mapa</Text>
      </Modal>
  )
}

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos para usar la galería.Accede manualmente para cambiarlo.",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar la foto",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen", //titulo
      "¿ Estás seguro ?", //subtitulo
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImage}>
      {size(imagesSelected) < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyles}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </View>
  );
}

// variables
const variables = {
  widthIcon: 66,
  heightIcon: 66,
};

//estilos
const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: { marginBottom: 10 },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: variables.heightIcon,
    width: variables.widthIcon,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyles: {
    height: variables.heightIcon,
    width: variables.widthIcon,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
});
