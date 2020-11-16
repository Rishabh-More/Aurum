import React, { useState, useEffect, useCallback, useMemo } from "react";
import DeviceInfo from "react-native-device-info";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { useTheme, useNavigation } from "@react-navigation/native";
import { isTablet } from "react-native-device-detection";
import { generateLoginOTP } from "../api/ApiService";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Title, Subheading, TextInput, HelperText } from "react-native-paper";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-simple-toast";
//TODO For Now, just use uniqueId for Login Api
export default function Login() {
  //Configs
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const { colors, dark } = useTheme();

  const InputTheme = {
    colors: {
      placeholder: colors.accent,
      primary: colors.accent,
      error: "red",
    },
  };

  /** State Codes */
  //States
  const [isEmulator, setIsEmulator] = useState(false);
  const [isReady, setReady] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
    licenseKey: "",
    deviceName: "",
  });
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  //Errors
  const [errorEmail, setEmailError] = useState(false);
  const [errorPWD, setPWDError] = useState(false);
  const [errorLicense, setLicenseError] = useState(false);
  const [errorDevice, setDeviceError] = useState(false);

  //Error Messages
  const [messageEmail, setEmailMessage] = useState("Looks Good");
  const [messagePWD, setPWDMessage] = useState("All Good");

  useEffect(() => {
    DeviceInfo.isEmulator().then((isEmulator) => {
      console.log("isEmulator?", isEmulator);
      setIsEmulator(isEmulator);
    });
  }, []);

  useEffect(() => {
    console.log("login", login);
  }, [login]);

  useEffect(() => {
    if (isReady) {
      GenerateOTP();
    } else {
      setLoading(false);
    }
  }, [isReady]);

  async function VerifyInputs() {
    setLoading(true);
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (login.email == "") {
      //Email cannot be empty
      await setLoading(false);
      setEmailMessage("Email cannot be Blank!");
      setEmailError(true);
      return;
    } else if (login.email != "" && !pattern.test(login.email)) {
      //Email is not valid
      await setLoading(false);
      setEmailMessage("This is not a valid email address!");
      setEmailError(true);
      return;
    } else {
      console.log("resolved email");
      setEmailMessage("");
      setEmailError(false);
    }
    if (login.password == "") {
      //Password cannot be empty
      await setLoading(false);
      setPWDMessage("Password cannot be Empty!");
      setPWDError(true);
      return;
    } else if (login.password.length < 5) {
      //Password must be minimum 5 characters.
      await setLoading(false);
      setPWDMessage("Password must be of minimum 5 characters!");
      setPWDError(true);
      return;
    } else {
      console.log("resolved password");
      setPWDMessage("");
      setPWDError(false);
    }
    if (login.licenseKey == "") {
      //License Key can't be Empty
      await setLoading(false);
      setLicenseError(true);
      return;
    } else {
      console.log("License resolved");
      setLicenseError(false);
    }
    if (login.deviceName == "") {
      //Device Name can't be empty as well
      await setLoading(false);
      setDeviceError(true);
      return;
    } else {
      console.log("Device name resolved");
      setDeviceError(false);
    }
    Toast.show("Validation Successful");
    console.log("login body", login);
    GetDeviceDetails();
  }

  async function GetDeviceDetails() {
    if (!isEmulator) {
      //TODO Fill in the device details.
      if (Platform.OS == "android") {
        //Set Device brand name
        await setLogin({
          ...login,
          brandName: DeviceInfo.getBrand(),
          modelName: DeviceInfo.getModel(),
          deviceId: DeviceInfo.getUniqueId(),
          otp: "",
          vendorId: "vendor123",
        });
        await setReady(true);
      } else {
        //For iOS
      }
    } else {
      Toast.show("Oops, DeviceID not available for Emulator");
    }
  }

  async function GenerateOTP() {
    if (isReady) {
      console.log("calling api");
      await generateLoginOTP(login)
        .then((data) => {
          console.log("login success?", data);
          Toast.show("An OTP has been sent to your Registered Email Id", Toast.LONG);
          setLoading(false);
          setReady(false);
        })
        .catch((error) => {
          console.log("login error", error);
          setLoading(false);
          setReady(false);
          return;
        });
      navigation.navigate("verify", login);
    } else {
      console.log("still not ready");
    }
  }

  function MobileContent() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.accent }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}></View>
        <View style={{ flex: 3, justifyContent: "center" }}>
          {/**Main Content */}
          <View style={[styles.content, { backgroundColor: colors.primary }]}>
            <View style={{ flex: 1 }}>
              {/**For Header */}
              <Header />
            </View>
            <View style={{ flex: 5 }}>
              {/**For Content */}
              <ScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag">
                <LoginContent />
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              {/**For Footer */}
              <Footer />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function TabContent() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.accent,
          flexDirection: orientation.landscape ? "row" : "column",
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}></View>
        <View style={{ flex: 1.5, justifyContent: "center" }}>
          {/**Main Content */}
          <View style={[styles.content, { backgroundColor: colors.primary }]}>
            {/**Header Wrapper */}
            <View style={{ justifyContent: "center" }}>
              {/**Header Title */}
              <Header />
            </View>
            {/**Content Wrapper */}
            <LoginContent />
            {/**Footer Wrapper */}
            <View style={{ justifyContent: "center" }}>
              {/** Login Button */}
              <Footer />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function Header() {
    return (
      <View style={{ margin: "5%" }}>
        <Title>Welcome User</Title>
        <Subheading>Please Sign In to Continue..</Subheading>
      </View>
    );
  }

  function Footer() {
    return (
      <View style={{ margin: isTablet ? "5%" : "3.5%" }}>
        <Button
          title="Login"
          loading={loading}
          ViewComponent={LinearGradient}
          containerStyle={{ maxWidth: isTablet ? "45%" : "100%" }}
          buttonStyle={{ height: 50, borderRadius: 10 }}
          linearGradientProps={{
            colors: [colors.accent, colors.accentLight],
            start: { x: 1, y: 1 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => {
            VerifyInputs();
            //navigation.navigate("verify");
          }}
        />
      </View>
    );
  }

  function LoginContent() {
    return (
      <View style={{ margin: "3%" }}>
        {/**Login & Email Wrapper */}
        <View style={{ flexDirection: isTablet ? "row" : "column" }}>
          <View style={styles.input}>
            <TextInput
              mode="outlined"
              label="Email"
              value={login.email}
              error={errorEmail}
              theme={InputTheme}
              onChangeText={(text) => setEmail(text)}
            />
            {errorEmail ? (
              <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
                {messageEmail}
              </HelperText>
            ) : null}
          </View>
          <View style={styles.input}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Password"
                value={login.password}
                error={errorPWD}
                theme={InputTheme}
                secureTextEntry={secureEntry}
                style={{ flex: 1, marginBottom: 5, marginEnd: isTablet ? 15 : 5 }}
                onChangeText={(text) => setLogin({ ...login, password: text })}
              />
              <Button
                icon={
                  <Icon
                    name={secureEntry ? "eye-off-outline" : "eye-outline"}
                    size={30}
                    color={colors.primary}
                  />
                }
                buttonStyle={{
                  width: 55,
                  aspectRatio: 1,
                  backgroundColor: colors.accent,
                  borderRadius: 10,
                }}
                containerStyle={{ marginStart: 5 }}
                onPress={async () => setSecureEntry(!secureEntry)}
              />
            </View>
            {errorPWD ? (
              <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
                {messagePWD}
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
              value={login.licenseKey}
              error={errorLicense}
              theme={InputTheme}
              onChangeText={(text) => setLogin({ ...login, licenseKey: text })}
            />
            {errorLicense ? (
              <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
                License Key cannot be Empty!
              </HelperText>
            ) : null}
          </View>
          <View style={styles.input}>
            <TextInput
              mode="outlined"
              label="Device Name"
              value={login.deviceName}
              error={errorDevice}
              theme={InputTheme}
              onChangeText={(text) => setLogin({ ...login, deviceName: text })}
            />
            {errorDevice ? (
              <HelperText visible={true} type="error" theme={{ colors: { error: "red" } }}>
                Device Name cannot be empty
              </HelperText>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={colors.accent} />
      {isTablet ? <TabContent /> : <MobileContent />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: isTablet ? 0 : 1,
    margin: isTablet ? "8%" : "5%",
    justifyContent: "center",
    borderRadius: 25,
  },
  input: {
    flex: 1,
    margin: 5,
    marginStart: isTablet ? 20 : 10,
    marginEnd: isTablet ? 20 : 10,
  },
});
