/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useWaku} from '../Context/WakuContext';
import BottomSheet from '@gorhom/bottom-sheet';
import QRCode from 'react-native-qrcode-svg';
import {useAccount} from 'wagmi';
import {HostScreen} from '../types/Screen';

export const Host = ({navigation, route}: HostScreen) => {
  const {title} = route.params ?? {};

  const [partyName, setPartyName] = useState<string>(title ?? '');
  const [loading, setIsLoading] = useState(false);

  const {address} = useAccount();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [snapPoints] = useState(['1', '70%']);

  const {createParty} = useWaku();

  const isView = partyName === title;

  const onCreateParty = async () => {
    if (!partyName) {
      return;
    }

    if (isView) {
      bottomSheetRef.current?.expand();
      return;
    }

    setIsLoading(true);
    await createParty(partyName);
    setIsLoading(false);

    Keyboard.dismiss();
    bottomSheetRef.current?.snapToPosition('50%');

    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Party's Name</Text>
      <TextInput
        placeholder="Waku-1"
        onChangeText={value => setPartyName(value)}
        value={partyName}
        mode="outlined"
        style={styles.inputContainer}
        disabled={isView}
      />
      <Button
        onPress={onCreateParty}
        mode="contained-tonal"
        loading={loading}
        style={styles.create}>
        {isView ? 'View QR' : 'Create'}
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        index={-1}>
        <View style={[styles.container, {alignItems: 'center'}]}>
          <Text
            style={{marginBottom: 10, fontWeight: 'bold'}}
            variant="titleLarge">
            Share QR
          </Text>
          <QRCode size={240} value={`waku://${address ?? ''}/${partyName}`} />

          <Button
            onPress={navigation.goBack}
            mode="contained"
            style={{marginTop: 14, width: '60%'}}>
            Complete
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    marginBottom: 10,
  },
  create: {
    width: '100%',
    marginTop: 12,
  },
});
