import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '../theme/theme';

// A simple, cute procedural companion. `species` picks a silhouette,
// `stage` (0-3) scales/decorates it as the user completes wellness tasks,
// `mood` (happy/neutral/tired) tweaks the face.
export default function CompanionAvatar({ species = 'bear', stage = 0, mood = 'happy', size = 180 }) {
  const scale = 0.85 + stage * 0.05;
  const bodyColor = { bear: '#B5836B', cat: '#8C8C8C', fox: '#D98B4A', bunny: '#E9DCC9' }[species] || colors.primary;

  const face = {
    happy: <Path d="M75 115 Q90 128 105 115" stroke="#3A2E27" strokeWidth="3" fill="none" strokeLinecap="round" />,
    neutral: <Path d="M78 118 L102 118" stroke="#3A2E27" strokeWidth="3" fill="none" strokeLinecap="round" />,
    tired: <Path d="M75 120 Q90 112 105 120" stroke="#3A2E27" strokeWidth="3" fill="none" strokeLinecap="round" />,
  }[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      {/* ears */}
      <Circle cx="55" cy="55" r={18 * scale} fill={bodyColor} />
      <Circle cx="125" cy="55" r={18 * scale} fill={bodyColor} />
      {/* head */}
      <Circle cx="90" cy="95" r={55 * scale} fill={bodyColor} />
      {/* muzzle */}
      <Ellipse cx="90" cy="110" rx="28" ry="20" fill="#FBF7F0" />
      {/* eyes */}
      <Circle cx="75" cy="90" r="5" fill="#3A2E27" />
      <Circle cx="105" cy="90" r="5" fill="#3A2E27" />
      {/* nose */}
      <Ellipse cx="90" cy="102" rx="6" ry="4" fill="#3A2E27" />
      {face}
      {/* accessory unlocked at stage 2+: a little bandana for care streaks */}
      {stage >= 2 && <Path d="M60 140 Q90 155 120 140 L110 150 L70 150 Z" fill={colors.accent} />}
      {/* sparkle for stage 3 (fully thriving) */}
      {stage >= 3 && <Path d="M150 40 L153 48 L161 51 L153 54 L150 62 L147 54 L139 51 L147 48 Z" fill={colors.warning} />}
    </Svg>
  );
}
