/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View} from 'react-native';
import {SponsorScreen} from '../types/Screen';
import {Button, Text, TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {Center} from '../Components/Center';
import {shortAddress} from '../utils/address';
import {useBalance, usePrepareSendTransaction, useSendTransaction} from 'wagmi';
import {EstimateGasExecutionError} from 'viem';
import {parseEther} from 'viem';

export const Sponsor = ({route}: SponsorScreen) => {
  const {partyName, to} = route.params ?? {};

  const [value, setValue] = useState('');

  const {} = useBalance();

  const {config, error} = usePrepareSendTransaction({
    to: to ?? '',
    value: parseEther(value ?? '0.00001'),
    enabled: !!value,
    onError: () => {},
  });

  const {isLoading, sendTransaction} = useSendTransaction(config);

  const isGasError = error instanceof EstimateGasExecutionError;

  if (!partyName || !to) {
    return (
      <Center>
        <Text>No data provided, please scan the QR again</Text>
      </Center>
    );
  }

  return (
    <View style={[styles.container]}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text variant="labelLarge">You're Sponsoring for party: </Text>
        <Text variant="bodySmall">{partyName}</Text>
      </View>
      <Text>
        Receiver is <Text style={{fontWeight: 'bold'}}>{shortAddress(to)}</Text>
      </Text>
      <View
        style={{
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 60,
        }}>
        <TextInput
          label={'Amount'}
          placeholder="0.1 ETH"
          value={value}
          onChangeText={_value => setValue(_value)}
          keyboardType="number-pad"
        />

        {isGasError && (
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: 'red',
              marginVertical: 5,
            }}>
            Not Enough amount to complete the transaction
          </Text>
        )}

        <Button
          mode="contained-tonal"
          style={{marginTop: 20}}
          loading={isLoading}
          onPress={() => {
            console.log(sendTransaction, 'trans?');
            sendTransaction?.();
          }}>
          Send
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    position: 'relative',
    alignItems: 'center',
  },
});
