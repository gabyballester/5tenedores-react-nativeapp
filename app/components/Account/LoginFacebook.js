import React from "react";
import { SocialIcon } from "react-native-elements";

export default function LoginFacebook() {
    const login =()=>{
        console.log("Facebook login..");
    }
    
    return (
        <SocialIcon
            title="Iniciar sesión con Facebook"
            button
            type="facebook"
            onPress={login}
        />
    )
}