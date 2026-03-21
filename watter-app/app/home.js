import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../src/services/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const db = getFirestore(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState(0);
  const [water, setWater] = useState(0);
  const [history, setHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const router = useRouter();

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else router.replace("/");
    });
    return unsubscribe;
  }, []);

  // 🔔 Permissão
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // 📊 Dados
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGoal(docSnap.data().goal);
      }

      const today = new Date().toISOString().split("T")[0];

      const q = query(
        collection(db, "waterLogs"),
        where("userId", "==", user.uid),
        where("date", "==", today)
      );

      const snapshot = await getDocs(q);

      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount;
      });

      setWater(total);

      // histórico
      const historyQuery = query(
        collection(db, "waterLogs"),
        where("userId", "==", user.uid)
      );

      const historySnap = await getDocs(historyQuery);

      const data = {};
      historySnap.forEach((doc) => {
        const { date, amount } = doc.data();
        if (!data[date]) data[date] = 0;
        data[date] += amount;
      });

      const historyArray = Object.entries(data).map(([date, total]) => ({
        date,
        total
      }));

      setHistory(historyArray.reverse());
    };

    fetchData();
  }, [user]);

  // 🔔 Notificação
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de beber água 💧",
        body: "Não esqueça de se hidratar!"
      },
      trigger: { seconds: 3600, repeats: true }
    });
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  // 💧 +250
  const addWater = async () => {
    if (!user) return;
    setWater((prev) => prev + 250);
    await addWaterLog(user.uid, 250);
  };

  // 💧 custom
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

  if (!user) {
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
        alignItems: "center",
        marginBottom: 20
      }}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle" size={32} color="#1C4A99" />
        </TouchableOpacity>

        <TouchableOpacity onPress={scheduleNotification}>
          <Ionicons name="notifications" size={28} color="#1C4A99" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#1C4A99" />
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <View style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 25,
        padding: 20,
        flex: 1
      }}>

        <Text style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#1C4A99",
          textAlign: "center",
          marginBottom: 15
        }}>
          Controle de Hidratação 
        </Text>

        <Text style={{ color: "#1C4A99" }}>
          Meta diária: {goal} ml
        </Text>

        <Text style={{ color: "#1C4A99", marginBottom: 15 }}>
          Consumido hoje: {water} ml
        </Text>

        <TouchableOpacity onPress={addWater} style={button}>
          <Text style={buttonText}>+250 ml</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Quantidade (ml)"
          placeholderTextColor="#555"
          value={customAmount}
          onChangeText={setCustomAmount}
          keyboardType="numeric"
          style={input}
        />

        <TouchableOpacity onPress={addCustomWater} style={button}>
          <Text style={buttonText}>Adicionar</Text>
        </TouchableOpacity>

        {/* HISTÓRICO */}
        <Text style={{
          marginTop: 20,
          marginBottom: 10,
          fontSize: 18,
          color: "#1C4A99"
        }}>
          Histórico
        </Text>

        <ScrollView>
          {history.map((item, index) => {
            const bateuMeta = item.total >= goal;
            const falta = goal - item.total;

            const dataFormatada = new Date(item.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short"
            });

            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 16,
                  marginBottom: 10
                }}
              >
                <Text style={{ color: "#1C4A99", fontWeight: "bold" }}>
                  {dataFormatada}
                </Text>

                <Text style={{ color: "#334155", marginTop: 5 }}>
                  {item.total} ml
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    color: bateuMeta ? "green" : "red"
                  }}
                >
                  {bateuMeta
                    ? "Meta atingida 🎉"
                    : `Faltaram ${falta} ml`}
                </Text>
              </View>
            );
          })}
        </ScrollView>

      </View>
    </LinearGradient>
  );
}

/* estilos */
const input = {
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 16,
  marginBottom: 12
};

const button = {
  backgroundColor: "#1C4A99",
  padding: 16,
  borderRadius: 16,
  marginBottom: 10
};

const buttonText = {
  color: "#fff",
  textAlign: "center",
  fontWeight: "bold"
};