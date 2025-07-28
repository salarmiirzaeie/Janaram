import React, { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

const WheelComponent = ({ steps = 12, size = 200 }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);
  const lastRotation = useRef(0);
  const stepAngle = 360 / steps;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, moveY, x0, y0 } = gestureState;
        const centerX = size / 2;
        const centerY = size / 2;

        const startAngle = Math.atan2(y0 - centerY, x0 - centerX);
        const currentAngle = Math.atan2(moveY - centerY, moveX - centerX);
        let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);

        rotation.setValue(lastRotation.current + angleDiff);
      },
      onPanResponderRelease: () => {
        const currentRotation = rotation._value;
        let nearestStep = Math.round(currentRotation / stepAngle) * stepAngle;
        let stepIndex = Math.round(nearestStep / stepAngle) % steps;

        if (stepIndex < 0) stepIndex += steps;

        lastRotation.current = nearestStep;

        Animated.spring(rotation, {
          toValue: nearestStep,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();

        setCurrentStep(stepIndex);
      },
    })
  ).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.wheel,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {[...Array(steps)].map((_, index) => {
          const angle = (index * stepAngle * Math.PI) / 180;
          const x = (size / 2 - 20) * Math.cos(angle);
          const y = (size / 2 - 20) * Math.sin(angle);

          return (
            <View
              key={index}
              style={[
                styles.step,
                {
                  transform: [{ translateX: x }, { translateY: y }, { rotate: `${-index * stepAngle}deg` }],
                },
              ]}
            >
              <Text style={styles.stepText}>{index + 1}</Text>
            </View>
          );
        })}
      </Animated.View>
      <View style={[styles.innerCircle, { width: size * 0.6, height: size * 0.6 }]} />
      <Text style={styles.currentStep}>Step: {currentStep + 1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  wheel: {
    backgroundColor: "#f0f0f0",
    borderWidth: 4,
    borderColor: "#0000FF", // حاشیه آبی
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 999,
    zIndex: -1,
  },
  step: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0000FF", // اعداد آبی
    backgroundColor: "red",
  },
  currentStep: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WheelComponent;
