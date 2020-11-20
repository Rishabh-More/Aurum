import React, { useState, useEffect } from "react";
import { useStore } from "../config/Store";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { useNavigation, useTheme } from "@react-navigation/native";
import { isPhone, isTablet } from "react-native-device-detection";
import { getCustomersForShop, addCustomerToShop, generateOrder } from "../api/ApiService";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { Card, Title, TextInput, HelperText, Divider } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { Button } from "react-native-elements";
import { Fold } from "react-native-animated-spinkit";
import Toast from "react-native-simple-toast";

export default function Customers() {
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const { colors, dark } = useTheme();

  //State Codes
  const { state, dispatch } = useStore();
  const [isVisible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReady, setReady] = useState(false);
  const [picker, setPicker] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState({
    id: 0,
    isPrimary: 1,
    shopId: 115,
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [errorName, setNameError] = useState(false);
  const [errorEmail, setEmailError] = useState(false);
  const [errorAddress, setAddressError] = useState(false);
  const [order, setOrder] = useState({
    shopId: "115",
    customerId: 0,
    remarks: "",
    products: state.data.cart,
  });

  useEffect(() => {
    setVisible(true);
    getCustomersForShop(state.shop.id)
      .then((data) => {
        console.log("api response", data);
        let temp = data.map((item) => {
          item.id = String(item.id);
          return item;
        });
        console.log("fixed array", temp);
        console.log("items in cart", state.data.cart);
        setCustomers(data);
        setPicker(temp);
        setVisible(false);
      })
      .catch((error) => {
        console.log("response error", error);
      });
  }, []);

  useEffect(() => {
    console.log("selected updated", selected);
  }, [selected]);

  useEffect(() => {
    if (order.customerId != 0) {
      //Object is ready for export
      setReady(true);
    }
  }, [order]);

  useEffect(() => {
    if (isReady) {
      ExportOrder();
    }
  }, [isReady]);

  async function ValidateCustomer() {
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    //Step 1: Validate Customer fields.
    if (selected.name == "") {
      //customer name cannot be blank
      setNameError(true);
      return;
    } else {
      console.log("resolved name");
      setNameError(false);
    }
    if (selected.email == "") {
      //email cannot be empty
      setEmailError(true);
      return;
    } else if (selected.email != "" && !pattern.test(selected.email)) {
      //email cannot be Invalid
      setEmailError(true);
      return;
    } else {
      console.log("resolved email");
      setEmailError(false);
    }
    if (selected.addressLine1 == "") {
      //address cannot be empty
      setAddressError(true);
      return;
    } else {
      console.log("resolved address");
      setAddressError(false);
    }
    setLoading(true);
    //Step 2: Check if customer exists or not. If not
    // Add Customer to shop
    const found = customers.some(
      (item) =>
        item.name == selected.name &&
        item.email == selected.email &&
        item.addressLine1 == selected.addressLine1 &&
        item.phone == selected.phone
    );
    if (!found) {
      //Call the api, add customer to shop
      addCustomerToShop(selected)
        .then(async (data) => {
          console.log("add customers response", data);
          await setSelected({ ...selected, id: data.id });
        })
        .catch((error) => {
          Toast.show("Couldn't Add Customer to Shop");
          console.log("response error", error);
          setLoading(false);
          return;
        });
    }
    //Step 3: Call the Order Api
    Toast.show("Validated Sucessfully!!");
    await setOrder({ ...order, customerId: parseInt(selected.id) });
    //ExportOrder();
  }

  async function ExportOrder() {
    if (isReady) {
      let packet = {};
      await generateOrder(order)
        .then((data) => {
          console.log("order created", data);
          packet = {
            feature: "order",
            data: data,
          };
          dispatch({ type: "CLEAR_CART" });
          setLoading(false);
        })
        .catch((error) => {
          console.log("response error", error);
          Toast.show("Failed to Generate Order");
          setLoading(false);
          return;
        });
      navigation.navigate("success", packet);
    } else {
      Toast.show("Oops couldn't Generate Order");
    }
  }

  function Customers() {
    return (
      <View style={{ flex: 1, backgroundColor: "white", margin: 5, borderRadius: 15 }}>
        <Title style={styles.title}>Shop Customers</Title>
        {isVisible ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
            }}>
            <Fold size={24} color={colors.accent} style={{ margin: 10 }} />
            <Text style={{ color: colors.text }}>Please Wait, getting your Customers</Text>
          </View>
        ) : null}
        <MultiSelect
          single={true}
          items={picker}
          uniqueKey="id"
          hideTags={false}
          fixedHeight={true}
          selectText={selected.name != "" ? selected.name : "Select Customer"}
          selectedItems={[selected]}
          styleMainWrapper={styles.selectMainWrapper}
          styleDropdownMenu={styles.selectDropdownMenu}
          styleDropdownMenuSubsection={[
            styles.selectDropdownMenuSubSection,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
          styleTextDropdownSelected={[
            styles.selectTextDropdownSelected,
            { color: selected.name != "" ? colors.accent : colors.text },
          ]}
          styleInputGroup={[styles.selectInputGroup, { backgroundColor: colors.primary }]}
          styleSelectorContainer={[
            styles.selectSelectorContainer,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          styleListContainer={{ backgroundColor: colors.primary }}
          styleRowList={{ backgroundColor: colors.primary }}
          itemTextColor={colors.textSubtle}
          submitButtonColor={colors.accentDark}
          onSelectedItemsChange={(value) => {
            let picked = customers.find((item) => item.id == parseInt(value));
            console.log("picked customer object", picked);
            setSelected({
              ...selected,
              id: parseInt(picked.id),
              name: picked.name,
              email: picked.email,
              phone: picked.phone,
              addressLine1: picked.addressLine1,
              shopId: picked.shopId,
            });
          }}
        />
      </View>
    );
  }

  function Seperator() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {isPhone ? <Divider style={styles.divider} /> : null}
        <Text style={{ margin: 5, color: "grey" }}>or</Text>
        {isPhone ? <Divider style={styles.divider} /> : null}
      </View>
    );
  }

  function CreateCustomer() {
    return (
      <Card style={{ flex: 2, margin: 5, borderRadius: 15 }}>
        <View>
          <Title style={styles.title}>Enter Customer Details</Title>
          <View style={{ flexDirection: isTablet && orientation.landscape ? "row" : "column" }}>
            <View
              style={{
                flex: isTablet && orientation.landscape ? 1 : 0,
                marginStart: 10,
                marginEnd: isTablet && orientation.landscape ? 5 : 10,
                margin: 5,
              }}>
              <TextInput
                mode="outlined"
                label="Customer Name (required)"
                value={selected.name}
                error={errorName}
                theme={{
                  colors: { primary: colors.accent, background: colors.primary, error: "red" },
                }}
                onChangeText={(text) => setSelected({ ...selected, name: text })}
              />
              {errorName ? (
                <HelperText type="error" visible={errorName} theme={{ colors: { error: "red" } }}>
                  Customer Name must not be Empty
                </HelperText>
              ) : null}
            </View>
            <View
              style={{
                flex: isTablet && orientation.landscape ? 1 : 0,
                marginStart: isTablet && orientation.landscape ? 5 : 10,
                marginEnd: 10,
                margin: 5,
              }}>
              <TextInput
                mode="outlined"
                label="Customer Email (required)"
                value={selected.email}
                error={errorEmail}
                theme={{
                  colors: { primary: colors.accent, background: colors.primary, error: "red" },
                }}
                onChangeText={(text) => setSelected({ ...selected, email: text })}
              />
              {errorEmail ? (
                <HelperText type="error" visible={errorEmail} theme={{ colors: { error: "red" } }}>
                  Invalid Email Address
                </HelperText>
              ) : null}
            </View>
          </View>
          <View style={styles.address}>
            <TextInput
              mode="outlined"
              label="Customer Address (required)"
              value={selected.addressLine1}
              error={errorAddress}
              theme={{
                colors: { primary: colors.accent, background: colors.primary, error: "red" },
              }}
              multiline={true}
              onChangeText={(text) => setSelected({ ...selected, addressLine1: text })}
            />
            {errorAddress ? (
              <HelperText type="error" visible={errorAddress} theme={{ colors: { error: "red" } }}>
                Customer Address cannot be Empty
              </HelperText>
            ) : null}
          </View>
          <View style={styles.rowWrapper}>
            <TextInput
              mode="outlined"
              label="Contact No."
              value={selected.phone.toString()}
              theme={{ colors: { primary: colors.accent, background: colors.primary } }}
              style={styles.contact}
              onChangeText={(text) => setSelected({ ...selected, phone: parseInt(text) || 0 })}
            />
            <TextInput
              mode="outlined"
              label="Order Remarks"
              value={order.remarks}
              style={styles.remarks}
              theme={{ colors: { primary: colors.accent, background: colors.primary } }}
              onChangeText={(text) => setOrder({ ...order, remarks: text })}
            />
          </View>
        </View>
      </Card>
    );
  }

  function SubmitOrder() {
    return (
      <View>
        <Divider style={{ width: isPhone ? "90%" : "35%", alignSelf: "center" }} />
        <View>
          <Button
            title="Generate Order"
            loading={loading}
            buttonStyle={{
              height: 50,
              width: isPhone ? "100%" : "40%",
              alignSelf: "center",
              backgroundColor: colors.accent,
              borderRadius: 15,
            }}
            containerStyle={{ margin: 10 }}
            onPress={() => ValidateCustomer()}
          />
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {isPhone ? (
          <ScrollView>
            {Customers()}
            {Seperator()}
            {CreateCustomer()}
          </ScrollView>
        ) : (
          <View style={styles.tabContent}>
            {Customers()}
            {Seperator()}
            {CreateCustomer()}
          </View>
        )}
        {SubmitOrder()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    margin: "5%",
  },
  title: {
    marginStart: 10,
    marginTop: 10,
  },
  address: {
    marginStart: 10,
    marginEnd: 10,
    margin: 5,
  },
  contact: {
    flex: 1,
    margin: 5,
    marginStart: 0,
  },
  remarks: {
    flex: 1,
    margin: 5,
    marginEnd: 0,
  },
  rowWrapper: {
    flexDirection: "row",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  divider: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
  },
  selectMainWrapper: {
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  selectDropdownMenu: {
    margin: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  selectDropdownMenuSubSection: {
    borderRadius: 10,
    borderWidth: 1,
  },
  selectTextDropdownSelected: {
    padding: 5,
    paddingStart: 20,
    paddingEnd: 20,
  },
  selectInputGroup: {
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  selectSelectorContainer: {
    borderRadius: 10,
    borderWidth: 1,
  },
});
