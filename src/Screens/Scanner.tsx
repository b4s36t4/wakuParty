import React, {useEffect} from 'react';
import {Alert, Linking, StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Center} from '../Components/Center';
import {Link, useIsFocused} from '@react-navigation/native';
import {ScannerScreen} from '../types/Screen';

export const Scanner = ({navigation}: ScannerScreen) => {
  const scanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: code => {
      const value = code[0].value;
      if (!value) {
        return;
      }
      try {
        const wakuURL = new URL(value ?? '');
        if (wakuURL.protocol !== 'waku:') {
          throw new Error('Invalid Protocol');
        }
        const host = wakuURL.host;
        const partyName = wakuURL.pathname.replaceAll('/', '');
        navigation.navigate('Sponsor', {partyName: partyName, to: host});
      } catch (e) {
        Alert.alert('Invalid QR Code');
      }
    },
  });

  const device = useCameraDevice('back');
  const isFocused = useIsFocused();

  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (hasPermission) {
      return;
    }
    requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <Center>
        <Text>Please Give Camera Permission</Text>
        <Link
          onPress={() => {
            Linking.openSettings();
          }}
          to={''}>
          Open Settings
        </Link>
      </Center>
    );
  }

  if (!device) {
    return (
      <Center>
        <Text>No Camera Found, it's not possible to use this feature</Text>
      </Center>
    );
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon={'arrow-left'}
        style={styles.backIcon}
        size={20}
        mode="contained"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text variant="bodyLarge" style={styles.fontBold}>
        Scan the QR
      </Text>
      <View style={styles.cameraContainer}>
        <Camera
          codeScanner={scanner}
          device={device}
          isActive={isFocused}
          style={styles.camera}
          onError={() => {
            Alert.alert('There is a camera error, please restart the app');
          }}
          fps={10}
        />
      </View>
      <Button mode="contained-tonal" style={styles.chooseButton}>
        Choose from files
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
  cameraContainer: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    flex: 1,
    marginTop: 10,
  },
  camera: {
    height: '100%',
    borderWidth: 2,
    borderColor: 'black',
  },
  backIcon: {marginHorizontal: 0},
  fontBold: {fontWeight: '700'},
  chooseButton: {
    marginTop: 10,
    width: '100%',
  },
});
