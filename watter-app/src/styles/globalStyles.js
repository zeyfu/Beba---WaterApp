import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20
  },

  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
    fontWeight: "bold"
  },

  text: {
    color: colors.text,
    fontSize: 16
  },

  card: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

input: {
  backgroundColor: "#1e293b",
  color: "#fff",
  padding: 10,
  borderRadius: 8,
  marginBottom: 10
}
});

