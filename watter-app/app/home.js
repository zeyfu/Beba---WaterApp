import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const progress = goal > 0 ? water / goal : 0;
  const percentage = Math.min(progress * 100, 100);

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
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setGoal(docSnap.data().goal);

      const today = new Date().toISOString().split("T")[0];

      const snapshot = await getDocs(
        query(
          collection(db, "waterLogs"),
          where("userId", "==", user.uid),
          where("date", "==", today)
        )
      );

      let total = 0;
      snapshot.forEach((doc) => (total += doc.data().amount));
      setWater(total);

      const historySnap = await getDocs(
        query(collection(db, "waterLogs"), where("userId", "==", user.uid))
      );

      const data = {};
      historySnap.forEach((doc) => {
        const { date, amount } = doc.data();
        if (!data[date]) data[date] = 0;
        data[date] += amount;
      });

      setHistory(
        Object.entries(data)
          .map(([date, total]) => ({ date, total }))
          .reverse()
      );
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

  // 💧 adicionar água
  const addWaterAmount = async (amount) => {
    if (!user) return;

    await addWaterLog(user.uid, amount);
    setWater((prev) => prev + amount);
    setModalVisible(false);
  };

  const addCustomWater = async () => {
    if (!user) return;

    const amount = Number(customAmount);
    if (!amount) return;

    await addWaterAmount(amount);
    setCustomAmount("");
  };

  if (!user) return <Text style={{ padding: 20 }}>Carregando...</Text>;

  return (
    <View style={{ flex: 1 }}>
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
          <Ionicons name="person-circle" size={32} color="#1C4A99" onPress={() => router.push("/profile")} />
          <Ionicons name="notifications" size={28} color="#1C4A99" onPress={scheduleNotification} />
          <Ionicons name="log-out-outline" size={28} color="#1C4A99" onPress={handleLogout} />
        </View>

        {/* CARD */}
        <View style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 25,
          padding: 20,
          flex: 1
        }}>
          <Text style={title}>Controle de Hidratação</Text>

          <Text>Meta diária: {goal} ml</Text>
          <Text>Consumido hoje: {water} ml</Text>

          {/* BARRA */}
          <View style={{ marginVertical: 15 }}>
            <Text style={{ color: "#1C4A99", fontWeight: "bold" }}>
              {percentage.toFixed(0)}% da meta
            </Text>

            <View style={{
              height: 12,
              backgroundColor: "#e2e8f0",
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 5
            }}>
              <View style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: percentage >= 100 ? "#16a34a" : "#1C4A99"
              }} />
            </View>

            <Text style={{ marginTop: 5, fontSize: 12 }}>
              {water >= goal
                ? "Meta atingida 🎉"
                : `Faltam ${goal - water} ml`}
            </Text>
          </View>

          <Text style={subtitle}>Histórico</Text>

          <ScrollView>
            {history.map((item, index) => {
              const bateuMeta = item.total >= goal;

              return (
                <View key={index} style={card}>
                  <Text>{item.date}</Text>
                  <Text>{item.total} ml</Text>
                  <Text style={{ color: bateuMeta ? "green" : "red" }}>
                    {bateuMeta ? "Meta atingida" : "Meta não atingida"}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* BOTÃO + */}
      <TouchableOpacity style={fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "#fff", fontSize: 30 }}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={modalOverlay}>
          <View style={modal}>
            {[200, 250, 500].map((amt) => (
              <TouchableOpacity key={amt} style={button} onPress={() => addWaterAmount(amt)}>
                <Text style={buttonText}>+{amt} ml</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              placeholder="Quantidade personalizada"
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
              style={input}
            />

            <TouchableOpacity style={button} onPress={addCustomWater}>
              <Text style={buttonText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: "center" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* estilos */
const title = { fontSize: 20, fontWeight: "bold", marginBottom: 10, color:"#1C4A99"};
const subtitle = { marginTop: 15, fontWeight: "bold", color:"#1C4A99" };
const card = { backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 10 };
const button = { backgroundColor: "#1C4A99", padding: 15, borderRadius: 10, marginBottom: 10 };
const buttonText = { color: "#fff", textAlign: "center" };
const input = { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10 };
const fab = {
  position: "absolute",
  bottom: 30,
  right: 30,
  backgroundColor: "#1C4A99",
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center"
};
const modalOverlay = {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  padding: 20
};
const modal = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 20
};