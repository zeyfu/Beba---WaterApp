import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { registerUser } from "../src/services/auth";
import { saveUserData } from "../src/services/firestore";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={["#9DB8DB", "#6FA3E8"]}
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20
      }}
    >

      {/* CARD */}
      <View style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: 20,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
      }}>

        {/* TÍTULO */}
        <Text style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#1C4A99",
          textAlign: "center",
          marginBottom: 20
        }}>
          Criar Conta
        </Text>

        {/* INPUTS */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#555"
          onChangeText={setEmail}
          style={inputStyle}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#555"
          secureTextEntry
          onChangeText={setPassword}
          style={inputStyle}
        />

        <TextInput
          placeholder="Peso (kg)"
          placeholderTextColor="#555"
          onChangeText={setWeight}
          keyboardType="numeric"
          style={inputStyle}
        />

        <TextInput
          placeholder="Idade"
          placeholderTextColor="#555"
          onChangeText={setAge}
          keyboardType="numeric"
          style={inputStyle}
        />

        <TextInput
          placeholder="Sexo (M/F)"
          placeholderTextColor="#555"
          onChangeText={setGender}
          style={inputStyle}
        />

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity
          onPress={handleRegister}
          style={buttonStyle}
        >
          <Text style={buttonText}>CADASTRAR</Text>
        </TouchableOpacity>

        {/* VOLTAR */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={{ marginTop: 10 }}
        >
          <Text style={{
            textAlign: "center",
            color: "#1C4A99",
            fontWeight: "500"
          }}>
            Voltar
          </Text>
        </TouchableOpacity>

      </View>

    </LinearGradient>
  );
}

/* 🔧 estilos reutilizáveis */
const inputStyle = {
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 16,
  marginBottom: 12
};

const buttonStyle = {
  backgroundColor: "#1C4A99",
  padding: 16,
  borderRadius: 16,
  marginTop: 10
};

const buttonText = {
  color: "#fff",
  textAlign: "center",
  fontWeight: "bold"
};