import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="account"
        component={Account}
        options={{ title: "Mi Cuenta" }}
      />
      <Stack.Screen
        name="login" // Ruta login
        component={Login} // Componente a renderizar
        options={{ title: "Inicir sesión" }}
      />
      <Stack.Screen
        name="register" // Ruta login
        component={Register} // Componente a renderizar
        options={{ title: "Registro" }}
      />
    </Stack.Navigator>
  );
}
