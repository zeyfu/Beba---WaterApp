import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { registerUser } from "../src/services/auth";
import { saveUserData } from "../src/services/firestore";
import { globalStyles } from "../src/styles/globalStyles";
import { colors } from "../src/styles/theme";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      await saveUserData(user.uid, {
        email: email,
        weight: Number(weight),
        age: Number(age),
        gender: gender,
        goal: Number(weight) * 35
      });

      alert("Usuário criado com sucesso!");
      router.push("/home");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>📝 Cadastro</Text>

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
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Peso (kg)"
        placeholderTextColor="#aaa"
        onChangeText={setWeight}
        keyboardType="numeric"
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Idade"
        placeholderTextColor="#aaa"
        onChangeText={setAge}
        keyboardType="numeric"
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Sexo (M/F)"
        placeholderTextColor="#aaa"
        onChangeText={setGender}
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
          marginBottom: 20
        }}
      />

      <View style={{ marginBottom: 10 }}>
        <Button title="Cadastrar" onPress={handleRegister} />
      </View>

      <Button title="Voltar" onPress={() => router.push("/")} />

    </View>
  );
}