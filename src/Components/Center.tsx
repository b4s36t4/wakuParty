import React, {FC, PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';

export const Center: FC<PropsWithChildren> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
