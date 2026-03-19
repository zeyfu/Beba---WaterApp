import { View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../src/services/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { app } from "../src/services/firebaseConfig";
import { addWaterLog } from "../src/services/firestore";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { TextInput } from "react-native";
import { globalStyles } from "../src/styles/globalStyles";
import { colors } from "../src/styles/theme";

const db = getFirestore(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState(0);
  const [water, setWater] = useState(0);
  const [history, setHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const router = useRouter();

  // 🔐 Observa autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });

    return unsubscribe;
  }, []);

  //Permissão de notificação
  useEffect(() => {
  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Permissão de notificação negada");
    }
  };

  requestPermission();
}, [])

  // 🔵 Buscar dados do usuário + consumo
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // 🟢 Meta
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGoal(docSnap.data().goal);
      }

      // 🔵 Consumo de hoje
      const today = new Date().toISOString().split("T")[0];

      const q = query(
        collection(db, "waterLogs"),
        where("userId", "==", user.uid),
        where("date", "==", today)
      );

      const querySnapshot = await getDocs(q);

      let total = 0;

      querySnapshot.forEach((doc) => {
        total += doc.data().amount;
      });

      setWater(total);

      // 🟣 Histórico
      const qHistory = query(
        collection(db, "waterLogs"),
        where("userId", "==", user.uid)
      );

      const historySnapshot = await getDocs(qHistory);

      const data = {};

      historySnapshot.forEach((doc) => {
        const { date, amount } = doc.data();

        if (!data[date]) {
          data[date] = 0;
        }

        data[date] += amount;
      });

      const historyArray = Object.entries(data).map(([date, total]) => ({
        date,
        total
      }));

      setHistory(historyArray);
    };

    fetchData();
  }, [user]);

  //Notificação
  const scheduleNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hora de beber água 💧",
      body: "Não esqueça de se hidratar!"
    },
    trigger: {
      seconds: 3600, // 1 hora
      repeats: true
    }
  });
};


  // 💧 Adicionar água
  const addWater = async () => {
    if (!user) return;

    setWater((prev) => prev + 250);

    await addWaterLog(user.uid, 250);
  };

  //Adicionar água personalida
  const addCustomWater = async () => {
  const amount = Number(customAmount);

  if (!amount || amount <= 0) {
    alert("Digite um valor válido");
    return;
  }

  setWater((prev) => prev + amount);

  await addWaterLog(user.uid, amount);

  setCustomAmount("");
};

  // ⏳ Loading
  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
  <View style={{
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20
  }}>

    <Text style={{
      fontSize: 24,
      color: "#fff",
      marginBottom: 20,
      fontWeight: "bold"
    }}>
      💧 Controle de Água
    </Text>

    {/* 📊 CARD PRINCIPAL */}
    <View style={{
      backgroundColor: "#1e293b",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15
    }}>
      <Text style={{ color: "#fff" }}>
        Meta diária: {goal} ml
      </Text>

      <Text style={{ color: "#fff", marginTop: 5 }}>
        Consumido hoje: {water} ml
      </Text>
    </View>

    {/* 💧 BOTÃO PRINCIPAL */}
    <View style={{ marginBottom: 10 }}>
      <Button title="+250ml" onPress={addWater} />
    </View>

    {/* ✏️ INPUT PERSONALIZADO */}
    <TextInput
      placeholder="Quantidade (ml)"
      placeholderTextColor="#aaa"
      value={customAmount}
      onChangeText={setCustomAmount}
      keyboardType="numeric"
      style={{
        backgroundColor: "#1e293b",
        color: "#fff",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
      }}
    />

    <View style={{ marginBottom: 10 }}>
      <Button title="Adicionar quantidade" onPress={addCustomWater} />
    </View>

    {/* 🔔 NOTIFICAÇÃO */}
    <View style={{ marginBottom: 10 }}>
      <Button title="Ativar lembrete" onPress={scheduleNotification} />
    </View>

    {/* 👤 PERFIL */}
    <View style={{ marginBottom: 10 }}>
      <Button
        title="Ir para Perfil"
        onPress={() => router.push("/profile")}
      />
    </View>

    {/* 📊 HISTÓRICO */}
    <View style={{ marginTop: 10 }}>
      <Text style={{
        color: "#fff",
        fontSize: 18,
        marginBottom: 5
      }}>
        Histórico
      </Text>

      {history.map((item, index) => (
        <Text key={index} style={{ color: "#cbd5f5" }}>
          {item.date} - {item.total} ml
        </Text>
      ))}
    </View>

    {/* 🚪 LOGOUT */}
    <View style={{ marginTop: 20 }}>
      <Button title="Logout" onPress={() => router.push("/")} />
    </View>

  </View>
);
}