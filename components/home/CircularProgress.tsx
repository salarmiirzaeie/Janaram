// CircularProgressBar.tsx

import React, {FC, ReactNode} from 'react';
import {View, Text} from 'react-native';
import {Svg, Circle} from 'react-native-svg';

interface CircularProgressBarProps {
  progress: number; // Should be a value between 0 and 1
  color: string;
  bgColor: string;
  stroke: number;
  children?: ReactNode;
}

const CircularProgressBar: FC<CircularProgressBarProps> = ({
  progress,
  color,
  bgColor,
  stroke,
  children,
}) => {
  const radius = 50; // Adjust the radius as needed
  const circumference = 2 * Math.PI * radius;
  const progressValue = progress * circumference;
  const offset = circumference - progressValue;

  return (
    <View>
      <Svg height={2 * radius} width={2 * radius}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - stroke / 2}
          stroke={bgColor}
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - stroke / 2}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${progressValue} ${circumference}`}
          strokeDashoffset={offset}
        />
      </Svg>
      {children && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default CircularProgressBar;
