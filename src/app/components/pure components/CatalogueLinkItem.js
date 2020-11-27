import React, { useEffect, useState } from "react";
import { useStore } from "../../config/Store";
import { useTheme } from "@react-navigation/native";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { isPhone, isTablet } from "react-native-device-detection";
import { responsive } from "../../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { regenerateLinkOtp, expireCatalogueLink, shortShareableLink } from "../../api/ApiService";
import { View, Text, StyleSheet, Share, Alert } from "react-native";
import { Card, Title, Portal, Dialog } from "react-native-paper";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Fold } from "react-native-animated-spinkit";
import Toast from "react-native-simple-toast";

const CatalogueLinkItem = ({ link, columns }) => {
  const orientation = useDeviceOrientation();
  const dimensions = useDimensions();
  const { colors, dark } = useTheme();

  //State Code
  const [shareDialog, setShareDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { state, dispatch } = useStore();

  useEffect(() => {
    console.log("links array is", state.data.links);
  }, [state.data.links]);

  async function generateNewOtp() {
    try {
      setGenerating(true);
      let otp = {
        id: link.id,
        otpCreatedAt: link.otpCreatedAt,
        otpExpireAt: link.otpExpireAt,
      };
      await regenerateLinkOtp(otp)
        .then((data) => {
          console.log("otp regenerated", data[0]);
          dispatch({ type: "UPDATE_LINKS_OTP", payload: data[0] });
          setGenerating(false);
          Toast.show("OTP Updated");
        })
        .catch((error) => {
          console.log("response error", error);
        });
    } catch (error) {
      console.log("error occured regenerate otp", error);
    }
  }

  function showConfirmationDialog() {
    Alert.alert("Expire Link", `Are you sure you want to delete the link: ${link.name}?`, [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          deleteLink();
        },
      },
    ]);
  }

  async function deleteLink() {
    try {
      setDeleting(true);
      expireCatalogueLink(link.id)
        .then((success) => {
          if (success) {
            const index = state.data.links.map((item) => item.id).indexOf(link.id);
            console.log("index is", index);
            dispatch({ type: "DELETE_LINK", payload: index });
            Toast.show(`Link Expired`);
          } else {
            alert("Failed to expire Link");
          }
          setDeleting(false);
        })
        .catch((error) => {
          console.log("response error", error);
        });
    } catch (error) {
      console.log("failed to expire", error);
    }
  }

  function getShortenedUrl() {
    setShareDialog(true);
    shortShareableLink(link.catalogueUrl)
      .then((url) => {
        console.log("shortened link is", url);
        //TODO Hide the Dialog and share this url via share method
        setShareDialog(false);
        shareCatalogueUrl(url);
      })
      .catch((error) => {
        console.log("shorturl eror", error);
      });
  }

  async function shareCatalogueUrl(url) {
    const baseMessage = `Hi,\nPlease Access your Catalogue using this link: ${url}.`;
    const message = link.otp != null ? `${baseMessage}\n OTP: ${link.otp}` : baseMessage;
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          console.log("link shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log("sharing error", error);
    }
  }

  return (
    <Card
      style={[
        styles.container,
        { width: dimensions.screen.width / columns - 2 * 5 }, // Compensated width with margin 2 * margin
      ]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Title
            style={{ fontSize: rf(responsive.text.linkTitle), marginTop: 10, marginStart: 10 }}>
            {link.name}
          </Title>
          <Text
            style={{ fontSize: rf(responsive.text.linkText), margin: 10, color: colors.text }}
            numberOfLines={1}>
            Link: {link.catalogueUrl}
          </Text>
          <View
            style={{
              margin: 5,
              height: 50,
              borderColor: link.otp != null ? colors.accent : "grey",
              backgroundColor: link.otp != null ? "transparent" : "rgba(128, 128, 128, 0.1)",
              borderRadius: 15,
              borderWidth: 0.5,
            }}>
            {link.otp != null ? (
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    flex: 1,
                    marginStart: 10,
                    marginEnd: 10,
                    fontSize: rf(1.8),
                    fontWeight: "900",
                    color: colors.text,
                  }}>
                  OTP: <Text style={{ color: colors.accent }}>{link.otp}</Text>
                </Text>
                <Button
                  loading={generating}
                  titleStyle={{ fontSize: rf(1.8) }}
                  buttonStyle={{ backgroundColor: colors.accent, borderRadius: 10 }}
                  containerStyle={{ width: isPhone ? 125 : 150, margin: 5, borderRadius: 10 }}
                  title="Regenerate OTP"
                  onPress={() => generateNewOtp()}
                />
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Share"
            type="outline"
            titleStyle={{
              fontSize: rf(responsive.text.linkButton),
              marginStart: 5,
              color: colors.accent,
            }}
            icon={<Icon name="share-variant" size={20} color={colors.accent} />}
            buttonStyle={{
              borderColor: colors.accent,
              height: 50,
              borderRadius: 15,
            }}
            containerStyle={{ margin: 5, height: 50 }}
            onPress={() => getShortenedUrl()}
          />
          <Button
            title="Expire Link"
            type="outline"
            loading={deleting}
            titleStyle={{
              fontSize: rf(responsive.text.linkButton),
              marginStart: 5,
              color: colors.accent,
            }}
            loadingProps={{ color: colors.accent }}
            icon={<Icon name="trash-can-outline" size={20} color={colors.accent} />}
            buttonStyle={{
              borderColor: colors.accent,
              height: 50,
              borderRadius: 15,
            }}
            containerStyle={{ margin: 5 }}
            onPress={() => showConfirmationDialog()}
          />
        </View>
      </View>
      <Portal>
        <Dialog visible={shareDialog} style={{ borderRadius: 15 }} dismissable={false}>
          <Dialog.Content style={{ alignItems: "center" }}>
            <Fold size={30} color={colors.accent} />
            <Text
              style={{ fontSize: rf(responsive.text.linkButton), margin: 15, color: colors.text }}>
              Please Wait, getting your link...
            </Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    margin: 5,
    borderRadius: 15,
    elevation: 3,
  },
  content: {
    //height: 200,
    flexDirection: "row",
  },
  info: {
    flex: 2,
    justifyContent: "space-evenly",
  },
  buttons: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default CatalogueLinkItem;
