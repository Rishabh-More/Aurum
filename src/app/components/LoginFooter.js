import React from "react";
import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { isTablet } from "react-native-device-detection";
import { responsive } from "../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import LinearGradient from "react-native-linear-gradient";

export function LoginFooter(props) {
  const { colors, dark } = useTheme();
  return (
    <View style={{ margin: isTablet ? "5%" : "3.5%" }}>
      <Button
        title="Login"
        loading={props.loading}
        ViewComponent={LinearGradient}
        titleStyle={{ fontSize: rf(responsive.text.loginFooter) }}
        containerStyle={{ maxWidth: isTablet ? "45%" : "100%" }}
        buttonStyle={{ height: 50, borderRadius: 10 }}
        linearGradientProps={{
          colors: [colors.accent, colors.accentLight],
          start: { x: 1, y: 1 },
          end: { x: 1, y: 0 },
        }}
        onPress={() => {
          props.VerifyInputs();
          //navigation.navigate("verify");
        }}
      />
    </View>
  );
}
