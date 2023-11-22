import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Host: {address?: string; title?: string} | undefined;
  Sponsor: {to?: string; partyName?: string} | undefined;
};

export type HomeScreen = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ScannerScreen = NativeStackScreenProps<
  RootStackParamList,
  'Scanner'
>;
export type HostScreen = NativeStackScreenProps<RootStackParamList, 'Host'>;
export type SponsorScreen = NativeStackScreenProps<
  RootStackParamList,
  'Sponsor'
>;
