import { useEffect, useState } from "react";
import { Linking, Text, View, Pressable } from "react-native";
import * as ExpoLinking from "expo-linking";

export default function CaptureScreen() {

  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {

    const loadInitialUrl = async () => {
      const url = await Linking.getInitialURL();

      if (!url) return;

      const parsed = ExpoLinking.parse(url);

      const query = parsed.queryParams ?? {};

      const normalized: Record<string, string> = {};

      Object.entries(query).forEach(([key, value]) => {
        normalized[key] = String(value ?? "");
      });

      setParams(normalized);
    };

    loadInitialUrl();

    const sub = Linking.addEventListener("url", ({ url }) => {

      const parsed = ExpoLinking.parse(url);

      const query = parsed.queryParams ?? {};

      const normalized: Record<string, string> = {};

      Object.entries(query).forEach(([key, value]) => {
        normalized[key] = String(value ?? "");
      });

      setParams(normalized);

    });

    return () => {
      sub.remove();
    };

  }, []);

  const returnToStaex = async () => {

    const callback = params.callback || "staex://damage-result";

    const resultUrl =
      `${callback}` +
      `?status=success` +
      `&txHash=test123` +
      `&proofId=proof456` +
      `&imageUrl=${encodeURIComponent("https://example.com/image.jpg")}`;

    await Linking.openURL(resultUrl);

  };

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
        padding: 24,
        justifyContent: "center"
      }}
    >

      <Text style={{ color: "white", fontSize: 26, fontWeight: "700", marginBottom: 20 }}>
        Staex Photo Module
      </Text>

      <Text style={{ color: "#aaa" }}>
        busId: {params.busId || "-"}
      </Text>

      <Text style={{ color: "#aaa" }}>
        driverName: {params.driverName || "-"}
      </Text>

      <Text style={{ color: "#aaa" }}>
        incidentDate: {params.incidentDate || "-"}
      </Text>

      <Text style={{ color: "#aaa" }}>
        damageLocation: {params.damageLocation || "-"}
      </Text>

      <Text style={{ color: "#aaa", marginBottom: 30 }}>
        severity: {params.severity || "-"}
      </Text>

      <Pressable
        onPress={returnToStaex}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 16,
          borderRadius: 14
        }}
      >

        <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
          Return to Staex
        </Text>

      </Pressable>

    </View>

  );

}