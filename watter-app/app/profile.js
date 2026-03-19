import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../src/styles/globalStyles";
import { colors } from "../src/styles/theme";

export default function Profile() {
  const router = useRouter();

  return (
    <View>
      <Text>Perfil</Text>

      <Button title="Logout" onPress={() => router.push("/")} />
    </View>
  );
}