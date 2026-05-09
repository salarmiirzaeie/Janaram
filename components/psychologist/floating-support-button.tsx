import { colors } from "@/app/(tabs)/psychologist";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const FloatingSupportButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCall = () => {
    Linking.openURL("tel:+989962424172");
    setModalVisible(false);
  };

  const handleBale = () => {
    Linking.openURL("http://ble.ir/janaram_support");
    setModalVisible(false);
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@janaram.com");
    setModalVisible(false);
  };

  return (
    <>
      {/* دکمه شناور */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.secondary[500],
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
          zIndex: 1000,
        }}
      >
        <Ionicons name="headset-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* مودال انتخاب روش ارتباط */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  width: "100%",
                  padding: 20,
                  paddingBottom: 30,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.gray[300],
                    borderRadius: 2,
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                />

                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "vazirBold",
                    color: colors.gray[800],
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  ارتباط با پشتیبانی
                </Text>

                {/* تماس تلفنی */}
                <TouchableOpacity
                  onPress={handleCall}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray[100],
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.primary[50],
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="call-outline"
                      size={24}
                      color={colors.primary[500]}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "vazirBold",
                        color: colors.gray[800],
                      }}
                    >
                      تماس تلفنی
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.gray[500] }}>
                      پشتیبانی ۲۴ ساعته
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray[400]}
                  />
                </TouchableOpacity>

                {/* واتساپ */}

                {/* بله */}
                <TouchableOpacity
                  onPress={handleBale}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray[100],
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#00AEEF10",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={24}
                      color="#00AEEF"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "vazirBold",
                        color: colors.gray[800],
                      }}
                    >
                      پیام در بله
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.gray[500] }}>
                      @janaram_support
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray[400]}
                  />
                </TouchableOpacity>

                {/* ایمیل */}
                <TouchableOpacity
                  onPress={handleEmail}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: colors.secondary[50],
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={24}
                      color={colors.secondary[500]}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "vazirBold",
                        color: colors.gray[800],
                      }}
                    >
                      ایمیل
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.gray[500] }}>
                      info@janaram.ir
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray[400]}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default FloatingSupportButton;
