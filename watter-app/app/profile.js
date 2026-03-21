import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../src/services/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../src/services/firebaseConfig";

const db = getFirestore(app);

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  // 🔍 Buscar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.replace("/");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    fetchUser();
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (!userData) {
    return <Text style={{ padding: 20 }}>Carregando...</Text>;
  }

  return (
    <LinearGradient
      colors={["#9DB8DB", "#6FA3E8"]}
      style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}
    >

      {/* TOPO */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1C4A99" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#1C4A99" />
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <View style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 25,
        padding: 20
      }}>

        <Text style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#1C4A99",
          textAlign: "center",
          marginBottom: 20
        }}>
          👤 Perfil
        </Text>

        <Text style={item}>Email: {userData.email}</Text>
        <Text style={item}>Peso: {userData.weight} kg</Text>
        <Text style={item}>Idade: {userData.age}</Text>
        <Text style={item}>Sexo: {userData.gender}</Text>
        <Text style={item}>Meta diária: {userData.goal} ml</Text>

      </View>
    </LinearGradient>
  );
}

const item = {
  fontSize: 16,
  color: "#334155",
  marginBottom: 10
};