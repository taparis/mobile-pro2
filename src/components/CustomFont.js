import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const FontText = (props) => {
  const flattenedStyle = StyleSheet.flatten(props.style);
  const isBold = flattenedStyle?.fontWeight === 'bold' || flattenedStyle?.fontWeight === '700';

  return (
    <Text
      {...props}
      style={[
        styles.defaultFont,
        props.style,
        isBold && { fontFamily: 'Kanit-Bold', fontWeight: 'normal' }
      ]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Kanit-Regular',
    color: '#333',
  },
});