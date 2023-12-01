/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View} from 'react-native';
import {SponsorScreen} from '../types/Screen';
import {Button, Text, TextInput} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {Center} from '../Components/Center';
import {shortAddress} from '../utils/address';
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';
import {EstimateGasExecutionError} from 'viem';
import {parseEther} from 'viem';
import {useWaku} from '../Context/WakuContext';

export const Sponsor = ({route}: SponsorScreen) => {
  const {partyName, to} = route.params ?? {};

  const [value, setValue] = useState('');

  const {address} = useAccount();

  const {data} = useBalance({address: address, enabled: !!address});

  const {sponsorParty} = useWaku();

  const [disabled, setIsDisabled] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const {config, error} = usePrepareSendTransaction({
    to: to ?? '',
    value: parseEther(value ?? '0.00001'),
    enabled: !!value,
    onError: () => {},
  });

  const {isLoading, sendTransaction, isSuccess} = useSendTransaction(config);

  const isGasError = error instanceof EstimateGasExecutionError;

  useEffect(() => {
    if (!isSuccess || !value) {
      return;
    }
    setIsNotifying(true);
    sponsorParty(value).finally(() => setIsNotifying(false));
  }, [isSuccess, sponsorParty, value]);

  if (!partyName || !to) {
    return (
      <Center>
        <Text>No data provided, please scan the QR again</Text>
      </Center>
    );
  }

  console.log(data, 'balance..');

  return (
    <View style={[styles.container]}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginHorizontal: 100,
        }}>
        <Text variant="labelLarge">You're Sponsoring for party: </Text>
        <Text variant="bodySmall" style={{fontWeight: 'bold'}}>
          {partyName}
        </Text>
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
          disabled={disabled}
        />

        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            marginVertical: 5,
          }}>
          Available Balance is {data?.formatted ?? 'NA'}
        </Text>

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
            setIsDisabled(true);
            console.log(sendTransaction, 'trans?');
            sendTransaction?.();
          }}>
          {isNotifying ? 'Sending Notification' : 'Send'}
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
