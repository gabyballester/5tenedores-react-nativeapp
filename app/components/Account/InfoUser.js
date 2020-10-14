import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";

export default function InfoUser(props) {
    const { userInfo, userInfo: {
        photoURL, displayName, email
    } } = props;
    console.log(photoURL);
    console.log(displayName);
    console.log(email);

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded size="large"
                showEditButton
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