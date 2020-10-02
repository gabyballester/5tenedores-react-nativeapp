import React from "react";
import { StyleSheet, View, ScrollView, Text, Image }
    from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
    const navigation = useNavigation();
    console.log(navigation);
    return (
        <ScrollView
            centerContent={true}
            style={styles.viewBody}
        >
            <Image
                source={
                    require("../../../assets/img/user-guest.jpg")
                }
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de 5 Tenedores</Text>
            <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
                dolore eos nulla laudantium officia earum culpa deserunt soluta amet a,
                porro impedit dicta, iste eveniet. Et, obcaecati consequatur.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={styles.btnStyle} // estilo del botón
                    containerStyle={styles.btnContainer} // estilo del contenedor
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description: {
        textAlign: "center",
        marginBottom: 20,
    },
    viewBtn: {
        flex: 1,
        alignItems: "center",
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        width: "70%"
    }
});