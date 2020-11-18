import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { isTablet } from "react-native-device-detection";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function LoginContent(props) {
  console.log("received props is", props);
  const { colors, dark } = useTheme();
  const [secureEntry, setSecureEntry] = useState(true);

  const InputTheme = {
    colors: {
      placeholder: colors.accent,
      primary: colors.accent,
      error: "red",
    },
  };

  return (
    <View style={{ margin: "3%" }}>
      {/**Login & Email Wrapper */}
      <View style={{ flexDirection: isTablet ? "row" : "column" }}>
        <View style={styles.input}>
          <TextInput
            mode="outlined"
            label="Email"
            value={props.login.email}
            error={props.errorEmail}
            theme={InputTheme}
            onChangeText={(text) => props.setLogin({ ...props.login, email: text })}
          />
          {props.errorEmail ? (
            <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
              {props.messageEmail}
            </HelperText>
          ) : null}
        </View>
        <View style={styles.input}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              mode="outlined"
              label="Password"
              value={props.login.password}
              error={props.errorPWD}
              theme={InputTheme}
              secureTextEntry={secureEntry}
              style={{ flex: 1, marginBottom: 5, marginEnd: isTablet ? 15 : 5 }}
              onChangeText={(text) => props.setLogin({ ...props.login, password: text })}
            />
            <Button
              icon={
                <Icon
                  name={secureEntry ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={colors.accent}
                />
              }
              type="outline"
              buttonStyle={{
                width: 55,
                aspectRatio: 1,
                backgroundColor: colors.background,
                borderColor: colors.accent,
                borderWidth: 1,
                borderRadius: 10,
              }}
              containerStyle={{ marginStart: 5 }}
              onPress={async () => setSecureEntry(!secureEntry)}
            />
          </View>
          {props.errorPWD ? (
            <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
              {props.messagePWD}
            </HelperText>
          ) : null}
        </View>
      </View>
      {/**License & Device Wrapper */}
      <View style={{ flexDirection: isTablet ? "row" : "column" }}>
        <View style={styles.input}>
          <TextInput
            mode="outlined"
            label="License Key"
            value={props.login.licenseKey}
            error={props.errorLicense}
            theme={InputTheme}
            onChangeText={(text) => props.setLogin({ ...props.login, licenseKey: text })}
          />
          {props.errorLicense ? (
            <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
              License Key cannot be Empty!
            </HelperText>
          ) : null}
        </View>
        <View style={styles.input}>
          <TextInput
            mode="outlined"
            label="Device Name"
            value={props.login.deviceName}
            error={props.errorDevice}
            theme={InputTheme}
            onChangeText={(text) => props.setLogin({ ...props.login, deviceName: text })}
          />
          {props.errorDevice ? (
            <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
              Device Name cannot be empty
            </HelperText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    margin: 5,
    marginStart: isTablet ? 20 : 10,
    marginEnd: isTablet ? 20 : 10,
  },
});
