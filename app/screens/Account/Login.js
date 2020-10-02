import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";

export default function Login() {
    return (
        <ScrollView>
            <Image
                source={require("../../../assets/img/5tenedores-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <Text>Login Form</Text>
                <CreateAccount />
            </View>
            <Divider style={styles.divider} />
            <Text>Social Login</Text>
        </ScrollView>
    );
}

function CreateAccount() {
    return (
        <Text
            style={styles.textRegister}
        >¿Aún no tienes una cuenta? {" "}
            <Text //  texto clicable 
                style={styles.btnRegister}
                onPress={() => console.log("Registro")}
            >Regístrate</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginBottom: 20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
    }
});
