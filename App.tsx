/* eslint-disable react-native/no-inline-styles */
import '@walletconnect/react-native-compat';
import {NavigationContainer} from '@react-navigation/native';
import {WagmiConfig} from 'wagmi';
import {polygon} from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';
import React from 'react';
import {PaperProvider} from 'react-native-paper';

import {MainNavigator} from './src/Navigator/MainNavigator';
import {WakuProvider} from './src/Context/WakuContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// 1. Get projectId
const projectId = 'ba539d6f692c170372c9aa69db332a89';

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'waku://',
    universal: 'WakuParty.com',
  },
};

const chains = [polygon];

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
});

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <PaperProvider settings={{rippleEffectEnabled: false}}>
          <WagmiConfig config={wagmiConfig}>
            <WakuProvider>
              <MainNavigator />
              <Web3Modal />
            </WakuProvider>
          </WagmiConfig>
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
