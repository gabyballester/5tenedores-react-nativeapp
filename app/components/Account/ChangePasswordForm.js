import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangePasswordForm(props) {
    const { setShowModal, toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const { password, newPassword, repeatNewPassword } = formData;
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setErrors({});
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};
        if (
            !password |
            !newPassword ||
            !repeatNewPassword
        ) {
            errorsTemp = {
                password:
                    !password ?
                        "La contraseña no puede estar vacía" : "",
                newPassword:
                    !newPassword ?
                        "La contraseña no puede estar vacía" : "",
                repeatNewPassword:
                    !repeatNewPassword ?
                        "La contraseña no puede estar vacía" : "",
            };
        } else if (newPassword !== repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las contraseñas no coinciden",
                repeatNewPassword: "Las contraseñas no coinciden"
            };
        } else if (size(newPassword) < 6) {
            errorsTemp = {
                repeatNewPassword:
                    "Mínimo 6 caracteres",
                newPassword:
                    "Mínimo 6 caracteres"
            };
        } else {
            setIsLoading(true);
            await reauthenticate(password)
                .then(async () => {
                    await firebase.auth().currentUser
                        .updatePassword(newPassword)
                        .then(() => {
                            isSetErrors = true;
                            setIsLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        }).catch(() => {
                            errorsTemp = {
                                other:
                                    "Error al actualizar la contraseña"
                            }
                            setIsLoading(false);
                        })

                }).catch((error) => {
                    console.log(error);
                    errorsTemp = {
                        password:
                            "Contraseña incorrecta"
                    };
                    setIsLoading(false);
                })
        }
        isSetErrors && setErrors(errorsTemp);
    }

    return (

        <View style={styles.view}>

            <Input
                placeholder="Contraseña actual"
                constainerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ?
                        "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => (setShowPassword(!showPassword))
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />

            <Input
                placeholder="Nueva contraseña"
                constainerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ?
                        "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => (setShowPassword(!showPassword))
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />

            <Input
                placeholder="Repetir contraseña"
                constainerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ?
                        "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => (setShowPassword(!showPassword))
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
            />

            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            >
            </Button>

        </View>
    )
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: { marginBottom: 10 },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});