import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width - 20;
const TAB_WIDTH = CONTAINER_WIDTH / 5;

interface TabBarProps {
  state: any;
  navigation: any;
  descriptors: any;
  isSleepMode?: boolean;
}

const AnimatedTabBar: React.FC<TabBarProps> = ({
  state,
  navigation,
  descriptors,
  isSleepMode = false,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;
  const [tabPositions, setTabPositions] = useState<number[]>([]);

  useEffect(() => {
    if (tabPositions.length === state.routes.length) {
      Animated.spring(slideAnim, {
        toValue: tabPositions[state.index],
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    }

    // Bounce animation for the active tab icon
    Animated.sequence([
      Animated.spring(scaleAnims[state.index], {
        toValue: 1.2,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.spring(scaleAnims[state.index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();

    // Reset other tabs scale
    scaleAnims.forEach((anim: any, idx: any) => {
      if (idx !== state.index) {
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [state.index, tabPositions]);

  const onTabLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, width: tabWidth } = event.nativeEvent.layout;
    const tabCenter = x + tabWidth / 2;
    const sliderWidth = TAB_WIDTH; // Use original TAB_WIDTH to maintain size

    setTabPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = tabCenter - sliderWidth / 2;
      return newPositions;
    });
  };

  const getIcon = (routeName: string, color: string, size: number) => {
    const icons: Record<string, React.ReactNode> = {
      "(home)": <AntDesign name="home" size={size} color={color} />,
      explore: <Ionicons name="leaf-outline" size={size} color={color} />,
      sleep: <Feather name="moon" size={size} color={color} />,
      appointments: (
        <Ionicons name="calendar-outline" size={size} color={color} />
      ),
      reports: <AntDesign name="bar-chart" size={size} color={color} />,
      setting: <Feather name="user" size={size} color={color} />,
      psychologist: (
        <Ionicons name="chatbox-outline" size={size} color={color} />
      ),
    };
    return (
      icons[routeName] || <AntDesign name="home" size={size} color={color} />
    );
  };

  const getLabel = (routeName: string): string => {
    const labels: Record<string, string> = {
      "(home)": "خانه",
      explore: "مدیتیشن",
      sleep: "خواب آرام",
      appointments: "نوبت‌های من",
      reports: "حال من",
      setting: "پروفایل",
      psychologist: "روانشناس من",
    };
    return labels[routeName] || "خانه";
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Background with blur effect */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: isSleepMode ? "#1D1C1C" : "#FFFFFF",
              opacity: 0.95,
            },
          ]}
        />

        {/* Gradient border top */}
        <LinearGradient
          colors={
            isSleepMode
              ? ["rgba(71, 169, 218, 0.3)", "transparent"]
              : ["rgba(71, 169, 218, 0.5)", "transparent"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBorder}
        />

        {/* Animated slider */}
        <Animated.View
          style={[
            styles.slider,
            {
              width: TAB_WIDTH, // Use original TAB_WIDTH to maintain size
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#47A9DA", "#3D8FB8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sliderGradient}
          />
        </Animated.View>

        {/* Tab items */}
        <View style={styles.tabsContainer}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
                activeOpacity={0.7}
                onLayout={(event) => onTabLayout(event, index)}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [{ scale: scaleAnims[index] }],
                    },
                  ]}
                >
                  {getIcon(
                    route.name,
                    isFocused ? "#47A9DA" : isSleepMode ? "#8E8E93" : "#C7C7CC",
                    isFocused ? 26 : 22
                  )}
                </Animated.View>

                <Animated.Text
                  style={[
                    styles.label,
                    {
                      color: isFocused
                        ? "#47A9DA"
                        : isSleepMode
                        ? "#8E8E93"
                        : "#8E8E93",
                      fontSize: isFocused ? 12 : 11,
                      opacity: isFocused ? 1 : 0.8,
                    },
                  ]}
                >
                  {getLabel(route.name)}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Shadow for iOS */}
        {Platform.OS === "ios" && (
          <View
            style={[
              styles.shadow,
              {
                shadowColor: isSleepMode ? "#000" : "#47A9DA",
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  container: {
    position: "relative",
    height: 75,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontFamily: "vazirBold",
    marginTop: 2,
    includeFontPadding: false,
  },
  slider: {
    position: "absolute",
    top: 0,
    height: 3,
  },
  sliderGradient: {
    flex: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default React.memo(AnimatedTabBar);
