import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import {useNavigation} from "@react-navigation/native";

export default function RegisterForm(props) {
    const { toastRef } = props;
    // iniciamos estado con contraseña oculta
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue());
    const navigation  = useNavigation();

    const minLengthPass = 6;

    const onSubmit = () => {
        //validación campos vacíos / rellenados
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.reapeatPassword)
        ) {
            toastRef.current.show("Todos los campos son obligatorios");
            // Si formulario es correcto, valida email
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("El email no es correcto");
        } else if (formData.password !== formData.reapeatPassword) {
            toastRef.current.show("Las contraseñas tienen que ser iguales");
        } else if (size(formData.password) < minLengthPass) {
            toastRef.current.show(
                `Longitud de contraseña: minimo ${minLengthPass} caracteres`
            );
        } else {
            //Enviar a firebase
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    navigation.navigate("account");
                })
                .catch(() => {
                    toastRef.current.show("El email ya está en uso, prueba con otro")
                })
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword}
                onChange={e => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        // Ternario para mostrar cada icono
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showRepeatPassword}
                onChange={e => onChange(e, "reapeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="eye-outline"
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        reapeatPassword: "",
    }
}


const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
});