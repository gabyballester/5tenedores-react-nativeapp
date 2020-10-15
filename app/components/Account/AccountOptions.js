import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";

export default function AccountOptions(props) {
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName": //devuelvo un componente Texto
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true) //abro el modal
                break;
            case "email": //devuelvo un componente Texto
                setRenderComponent(
                    <ChangeEmailForm
                        // email={userInfo.email}
                        email={userInfo.email ?
                            userInfo.email : "nomail@mail.es"}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true) //abro el modal
                break;
            case "password": //devuelvo un componente Texto
                setRenderComponent(
                    <Text>Cambiando Email</Text>
                );
                setShowModal(true) //abro el modal
                break;
            default:
                setRenderComponent(null);
                setShowModal(false) //modal cerrado
                break;
        }
    }

    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,
                    }}
                    containerStyle={styles.menuItem}
                    onPress={menu.onPress}
                />
            ))}
            {/* Ternario que muestra modal sólo si renderComponent existe */}
            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    )
}

function generateOptions(selectedComponent) {
    return [
        {
            title: "Editar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "ccc",
            onPress: () => selectedComponent("displayName")
        },
        {
            title: "Editar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "ccc",
            onPress: () => selectedComponent("email")
        },

        {
            title: "Editar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "ccc",
            onPress: () => selectedComponent("password")
        },
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    }
})