import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props) {
    const { userInfo: { uid, photoURL, displayName, email },
        toastRef } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        const resultPermissionCamera = resultPermission
            .permissions.cameraRoll.status

        if (resultPermissionCamera === "denied") {
            tostRef.current
                .show("Es necesario aceptar los permisos de la galería");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if (result.cancelled) { // si el usuario cancela
                toastRef.current
                    .show("Has cerrado la selección de imágenes")
            } else {
                uploadImage(result.uri)
                    .then(() => {
                        console.log("Imagen subida");
                    })
                    .catch(() => {
                        toastRef.current
                            .show("Error al actualizar el avatar");
                    })
            }
        }

    }

    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        //esto sube a la carpeta avatar de firebase y le doy nombre
        const ref = firebase.storage().ref().child(`avatar/${uid}.jpg`);
        //subida de archivo
        return ref.put(blob);
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={
                    // Si photoURL tiene contenido
                    photoURL ? { uri: photoURL } :
                        require("../../../assets/img/avatar-default.jpg")
                }
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>  {email ? email : "Social Login"}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    }
})