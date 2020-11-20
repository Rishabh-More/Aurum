import React, { useState, useEffect } from "react";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { useNavigation, useTheme } from "@react-navigation/native";
import { isPhone, isTablet } from "react-native-device-detection";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ToggleSwitch from "toggle-switch-react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Button } from "react-native-elements";
import { generateCatalogueLink } from "../api/ApiService";

export default function LinkOptions() {
  const realm = useDatabase();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  //State Codes
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [link, setLink] = useState({
    name: "",
    designNumbers: {
      designNumber: state.data.cart.map((item) => item.designNumber),
    },
    otpEnabled: 0,
    otpValidity: null,
    shopId: state.shop.id,
  });

  useEffect(() => {
    console.log("link object", link);
  }, [link]);

  async function ValidateOptions() {
    //Check if Link's Name is Empty or not
    if (link.name == "") {
      setError(true);
      return;
    } else {
      setError(false);
    }
    setVisible(true);
    if (link.otpEnabled == 1 && link.otpValidity == null) {
      link.otpValidity = 2;
    } else if (link.otpEnabled == 0 && link.otpValidity != null) {
      link.otpValidity = null;
    }
    //console.log("link object for api", link);
    ExportCatalogueLink();
  }

  async function ClearCartItems() {
    try {
      await realm.write(() => {
        let cart = realm.objects("Cart");
        realm.delete(cart);
      });
      await dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.log("failed to clear cart", error);
    }
  }

  async function ExportCatalogueLink() {
    //TODO get all design numbers from cart as an array.
    console.log("exporting final object", link);
    let packet = {};
    await generateCatalogueLink(link)
      .then((data) => {
        packet = {
          feature: "link",
          data: data,
        };
        //dispatch({ type: "CLEAR_CART" });
        ClearCartItems();
      })
      .catch((error) => {
        console.log("generate link api error", error);
        setVisible(false);
      });
    navigation.navigate("success", packet);
    setVisible(false);
  }

  function ExportButton() {
    return (
      <View>
        <Button
          title="Generate Link"
          loading={visible}
          buttonStyle={{ backgroundColor: colors.accent, height: 50, borderRadius: 15 }}
          containerStyle={{ margin: 10 }}
          onPress={() => {
            ValidateOptions();
          }}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ margin: isPhone ? "5%" : "25%" }}>
          <View style={{ flexDirection: "column" }}>
            <TextInput
              mode="outlined"
              label="Link Name (required)"
              theme={{
                colors: {
                  placeholder: colors.accent,
                  primary: colors.accent,
                  background: colors.primary,
                  error: "red",
                },
              }}
              value={link.name}
              error={error}
              onChangeText={(text) => setLink({ ...link, name: text })}
            />
            {error ? (
              <HelperText type="error" visible={error} theme={{ colors: { error: "red" } }}>
                Link Name cannot be Empty
              </HelperText>
            ) : null}
            {/* <CheckBox center title="Enable OTP?" checked={true} checkedColor={colors.accent} /> */}
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <ToggleSwitch
                isOn={link.otpEnabled == 1 ? true : false}
                onColor={colors.accent}
                size="medium"
                label="Enable OTP?"
                labelStyle={{ color: colors.text, fontSize: 16 }}
                onToggle={() => {
                  let enable = link.otpEnabled == 1 ? 0 : 1;
                  console.log("enable is", enable);
                  setLink({ ...link, otpEnabled: enable });
                }}
              />
            </View>
          </View>
          {link.otpEnabled ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginStart: isTablet ? "15%" : 0,
                marginEnd: isTablet ? "15%" : 0,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>
                OTP for generated link will expire in:{" "}
              </Text>
              <DropDownPicker
                placeholder="Pick a Duration"
                items={[
                  { label: "1 Hour", value: 1 },
                  { label: "2 Hours", value: 2 },
                  { label: "4 Hours", value: 4 },
                  { label: "8 Hours", value: 8 },
                  { label: "12 Hours", value: 12 },
                ]}
                defaultValue={2}
                containerStyle={{ height: 50, flex: 1 }}
                style={{ backgroundColor: colors.primary, borderColor: colors.border }}
                dropDownStyle={{ backgroundColor: colors.primary, borderColor: colors.border }}
                labelStyle={{ color: colors.text }}
                selectedLabelStyle={{ color: colors.text }}
                activeItemStyle={{ backgroundColor: colors.accent }}
                arrowColor={colors.text}
                onChangeItem={(item) => setLink({ ...link, otpValidity: item.value })}
              />
            </View>
          ) : null}
          {isTablet ? ExportButton() : null}
        </View>
      </View>
      {isPhone ? ExportButton() : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
