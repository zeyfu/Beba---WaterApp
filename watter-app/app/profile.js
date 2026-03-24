import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../src/services/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../src/services/firebaseConfig";
import { updateUserData } from "../src/services/firestore";

// 🔔 notifications
import {
  getNotificationSettings,
  saveNotificationSettings
} from "../src/services/notifications";

const db = getFirestore(app);

export default function Profile() {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  // 🔔 notificações
  const [interval, setIntervalState] = useState("3600");

  // 🔍 Buscar dados
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // 👤 user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setName(data.name || "");
        setGoal(String(data.goal || ""));
      }

      // 🔔 notifications
      const notif = await getNotificationSettings(user.uid);

      if (notif) {
        setIntervalState(String(notif.interval));
      }
    };

    fetchUser();
  }, []);

  // 💾 Salvar perfil
  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateUserData(user.uid, {
      name: name,
      goal: Number(goal)
    });

    alert("Perfil atualizado!");

    setUserData((prev) => ({
      ...prev,
      name,
      goal: Number(goal)
    }));
  };

  // 🔔 Salvar notificações
  const handleSaveNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await saveNotificationSettings(user.uid, {
      enabled: true, // mantém ativo
      interval: Number(interval)
    });

    alert("Configurações de notificação salvas!");
  };

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1C4A99" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#1C4A99" />
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 25,
          padding: 20
        }}
      >
        <Text style={title}>👤 Perfil</Text>

        <Text style={item}>Email: {userData.email}</Text>
        <Text style={item}>Peso: {userData.weight} kg</Text>
        <Text style={item}>Idade: {userData.age}</Text>
        <Text style={item}>Sexo: {userData.gender}</Text>

        {/* PERFIL */}
        <Text style={label}>Nome</Text>
        <TextInput value={name} onChangeText={setName} style={input} />

        <Text style={label}>Meta diária (ml)</Text>
        <TextInput
          value={goal}
          onChangeText={setGoal}
          keyboardType="numeric"
          style={input}
        />

        <TouchableOpacity style={button} onPress={handleSaveProfile}>
          <Text style={buttonText}>Salvar Perfil</Text>
        </TouchableOpacity>

        {/* 🔔 NOTIFICAÇÕES */}
        <Text style={section}>🔔 Notificações</Text>

        <Text style={label}>Intervalo (segundos)</Text>
        <TextInput
          value={interval}
          onChangeText={setIntervalState}
          keyboardType="numeric"
          style={input}
        />

        <TouchableOpacity style={button} onPress={handleSaveNotifications}>
          <Text style={buttonText}>Salvar Notificações</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

/* estilos */
const title = {
  fontSize: 22,
  fontWeight: "bold",
  color: "#1C4A99",
  textAlign: "center",
  marginBottom: 20
};

const section = {
  marginTop: 20,
  fontWeight: "bold",
  color: "#1C4A99",
  fontSize: 16
};

const item = {
  fontSize: 16,
  color: "#334155",
  marginBottom: 10
};

const label = {
  color: "#1C4A99",
  marginTop: 10,
  marginBottom: 5,
  fontWeight: "bold"
};

const input = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10
};

const button = {
  backgroundColor: "#1C4A99",
  padding: 15,
  borderRadius: 10,
  marginTop: 10
};

const buttonText = {
  color: "#fff",
  textAlign: "center"
};