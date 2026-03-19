import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { loginUser } from "../src/services/auth";
import { globalStyles } from "../src/styles/globalStyles";
import { colors } from "../src/styles/theme";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.push("/home");
    } catch (error) {
      alert("Erro ao logar: " + error.message);
    }
  };

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>🔐 Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
          marginBottom: 20
        }}
      />

      <View style={{ marginBottom: 10 }}>
        <Button title="Entrar" onPress={handleLogin} />
      </View>

      <Button
        title="Criar conta"
        onPress={() => router.push("/register")}
      />

    </View>
  );
}