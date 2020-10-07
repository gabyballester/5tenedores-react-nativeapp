import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import {validateEmail} from "../../utils/validations";

export default function LoginForm(props) {
    const {toastRef} = props;

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue());

    const onChange = (e, type) => { // maneja nuestro estado
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const onSubmit = () => { //envía formulario
        if(isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Todos los campos son obligatorios")
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("Email no es correcto")
        } else {
            console.log("OK");
        }
    };

    return (

        <View style={styles.formContainer}>

            <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputform}
                onChange={(e) => onChange(e, "email")}
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
                onChange={(e) => onChange(e, "password")}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />

            <Button
                title="Iniciar sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />

        </View>
    )
}

function defaultFormValue() {
    return {
        email: "", password: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})