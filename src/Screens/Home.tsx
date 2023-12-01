import {StyleSheet, View} from 'react-native';
import {HomeScreen} from '../types/Screen';
import {ActivityIndicator, AnimatedFAB, Button, Text} from 'react-native-paper';
import React, {useCallback, useRef} from 'react';
import {useAccount, useBalance} from 'wagmi';
import {Center} from '../Components/Center';
import {shortAddress} from '../utils/address';
import {W3mConnectButton} from '@web3modal/wagmi-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {useWaku} from '../Context/WakuContext';
import {Party} from '../protos';
import {ScrollView} from 'react-native-gesture-handler';

export const Home = ({navigation}: HomeScreen) => {
  const {address, status} = useAccount();

  const {parties} = useWaku();

  const historySheetRef = useRef<BottomSheet>(null);

  const openHistorySheet = () => {
    historySheetRef.current?.expand();
  };

  const renderItem = useCallback(
    (partyItem: any, index: number) => {
      const decodedItem = Party.decode(partyItem?.payload ?? []).toJSON();

      const onPressQRButton = () => {
        navigation.navigate('Host', {
          address: decodedItem.address,
          title: decodedItem.message,
        });
      };

      return (
        <View key={index} style={styles.historyCard}>
          <Text style={styles.cardText}>{decodedItem.message}</Text>
          <Button onPress={onPressQRButton} mode="contained-tonal">
            View QR
          </Button>
        </View>
      );
    },
    [navigation],
  );

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
        <W3mConnectButton label="Connect" loadingLabel="Connecting..." />
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
        onPress={openHistorySheet}
        iconMode="static"
        extended={false}
        animateFrom="left"
        style={styles.fabButton}
      />
      <BottomSheet
        ref={historySheetRef}
        snapPoints={['70%', '100%']}
        index={-1}
        enablePanDownToClose={true}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text variant="titleMedium">Previous Parties</Text>
          {parties.length > 0 ? (
            parties.map(renderItem)
          ) : (
            <Center>
              <Text variant="bodyLarge">
                You don't have any previous parties
              </Text>
              <Button
                style={{marginTop: 10}}
                mode="elevated"
                onPress={() => {
                  historySheetRef.current?.close();
                }}>
                Close
              </Button>
            </Center>
          )}
        </ScrollView>
      </BottomSheet>
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
  historyCard: {
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 14,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    justifyContent: 'space-between',
  },
  cardText: {width: '60%'},
  scrollContainer: {
    padding: 10,
    width: '100%',
    overflow: 'hidden',
    height: '100%',
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
    // right: '-%',
    left: '85%',
    bottom: 25,
  },
});
