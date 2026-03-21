import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { loginUser } from "../src/services/auth";
import { LinearGradient } from 'expo-linear-gradient';


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
      backgroundColor: "rgba(255,255,255,0.75)", // 🔥 transparência
      padding: 20,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    }}>

      {/* LOGO DENTRO */}
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: 300,
          height: 140,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 20
        }}
      />

          {/* TEXTO */}
    <Text style={{
      textAlign: "center",
      color: "#1C4A99",
      marginBottom: 20,
      fontSize: 16,
      fontWeight: "500"
    }}>
      Hidrate-se melhor todos os dias
    </Text>

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#555"
        onChangeText={setEmail}
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 16,
          marginBottom: 12
        }}
      />

      {/* SENHA */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#555"
        secureTextEntry
        onChangeText={setPassword}
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 16,
          marginBottom: 20
        }}
      />

      {/* BOTÃO ENTRAR */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#1C4A99",
          padding: 16,
          borderRadius: 16,
          marginBottom: 10
        }}
      >
        <Text style={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          ENTRAR
        </Text>
      </TouchableOpacity>

      {/* BOTÃO CADASTRO */}
      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{
          backgroundColor: "#163B7A",
          padding: 16,
          borderRadius: 16
        }}
      >
        <Text style={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          CRIAR CONTA
        </Text>
      </TouchableOpacity>

    </View>

  </LinearGradient>
);
}