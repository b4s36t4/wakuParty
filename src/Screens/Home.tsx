import {Alert, StyleSheet, View} from 'react-native';
import {HomeScreen} from '../types/Screen';
import {ActivityIndicator, AnimatedFAB, Button, Text} from 'react-native-paper';
import React from 'react';
import {useAccount} from 'wagmi';
import {Center} from '../Components/Center';
import {shortAddress} from '../utils/address';
import {W3mButton} from '@web3modal/wagmi-react-native';

export const Home = ({navigation}: HomeScreen) => {
  const {address, status} = useAccount();

  if (status === 'connecting') {
    return (
      <Center>
        <ActivityIndicator size={'small'} />
        <Text variant="titleMedium">Connecting...</Text>
      </Center>
    );
  }

  if (status === 'disconnected') {
    return (
      <Center>
        <Text>To Use the Application Please connect to your wallet</Text>
        <W3mButton />
      </Center>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Hello, 👋🏻</Text>
      <Text variant="labelLarge">
        You're Wallet is {shortAddress(address ?? '')}
      </Text>

      <Text style={{paddingTop: 10, marginTop: 20}} variant="headlineSmall">
        Use WakuParty App to instantly host/sponsor parties, receive instant
        notifications about payments powered by{' '}
        <Text variant="labelLarge">Waku</Text>
      </Text>

      <View style={styles.actionContainer}>
        <Text variant="titleMedium">Hosting Party? </Text>
        <Button
          onPress={() => {
            navigation.navigate('Host');
          }}
          style={styles.hostButton}
          mode="contained">
          Host
        </Button>
        <Text style={{marginTop: 20}} variant="titleMedium">
          Sponsoring Party?
        </Text>
        <Button
          onPress={() => {
            navigation.navigate('Scanner');
          }}
          style={styles.hostButton}
          mode="contained">
          Sponsor
        </Button>
      </View>
      <AnimatedFAB
        icon={'history'}
        label="Past Transactions"
        onPress={() => {
          Alert.alert('History Page');
        }}
        iconMode="static"
        extended={false}
        animateFrom="left"
        style={styles.fabButton}
      />
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
  },
  hostButton: {
    width: '80%',
    marginTop: 12,
  },
  actionContainer: {
    display: 'flex',
    marginTop: '-10%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    position: 'absolute',
    right: '-30%',
    bottom: 25,
  },
});
