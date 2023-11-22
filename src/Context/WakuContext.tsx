import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  start,
  isStarted,
  onMessage,
  newNode,
  peerID,
  connect,
  stop,
  Config,
  StoreQuery,
  ContentFilter,
  storeQuery,
  filterSubscribe,
  FilterSubscription,
  WakuMessage,
  lightpushPublish,
  dnsDiscovery,
} from '@waku/react-native';
import {useAccount} from 'wagmi';
import {Party} from '../protos';
import {Alert} from 'react-native';

interface WakuContext {
  nodeStarted: boolean;
  createParty: (title: string) => Promise<void>;
  parties: any[];
}

const context = createContext<WakuContext | null>(null);

const getQRTopic = (address: string) => `/wakuparty/1/qr-test-${address}/proto`;

const getNotificationTopic = (address: string) => {
  return `/wakuparty/1/notification-test-${address}/proto`;
};

const nodeConfig = new Config();
nodeConfig.relay = false;
nodeConfig.filter = true;

export const WakuProvider: FC<PropsWithChildren> = ({children}) => {
  const [nodeStarted, setIsNodeStarted] = useState(false);
  const {address, isConnected} = useAccount();

  const [isPeersConnecting, setIsPeersConnecting] = useState<boolean | null>(
    null,
  );

  const [parties, setParies] = useState<any[]>([]);

  const [qrTopic, setQRTopic] = useState('');

  const updateParties = useCallback(async () => {
    const isLoaded = await isStarted();
    if (!isLoaded) {
      return;
    }
    if (!qrTopic || isPeersConnecting !== false) {
      return;
    }
    const query = new StoreQuery();
    query.contentFilters.push(new ContentFilter(qrTopic));

    const result = await storeQuery(query);

    setParies(result.messages ?? []);
    console.log('[Query] Loaded all parties');
  }, [qrTopic, isPeersConnecting]);

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }
    const _topic = getQRTopic(address);
    setQRTopic(_topic);
  }, [address, isConnected]);

  const onMessageRecieve = (message: any) => {
    console.log(message, 'message');
  };

  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (isPeersConnecting === null) {
      return;
    }

    if (isPeersConnecting === false) {
      updateParties();
    }
  }, [isPeersConnecting, updateParties]);

  useEffect(() => {
    if (!address) {
      return;
    }
    setIsPeersConnecting(true);
    const loadWaku = async () => {
      let isLoaded;
      isLoaded = await isStarted();

      isLoadedRef.current = isLoaded.valueOf();

      if (!isLoaded) {
        await newNode(nodeConfig);
        await start();

        isLoaded = await isStarted();

        const _peers = await dnsDiscovery(
          'enrtree://AO47IDOLBKH72HIZZOXQP6NMRESAN7CHYWIBNXDXWRJRZWLODKII6@test.wakuv2.nodes.status.im',
          '1.1.1.1',
        );

        console.log(`[Peers] ${JSON.stringify(_peers)} via DNS`);

        if (_peers.length === 0) {
          Alert.alert('No Peers found through DNS Discovery');
          return;
        }

        for await (const peer of _peers) {
          for await (const multiAddress of peer.addrs) {
            try {
              await connect(multiAddress, 5000);
              console.log('[Connection] Connected to Peer');
            } catch (err) {
              console.log(err);
              console.log('[Connection] Peer connection error');
            }
          }
        }

        const filter = new FilterSubscription();
        filter.contentFilters.push(new ContentFilter(getQRTopic(address)));
        await filterSubscribe(filter);

        onMessage(onMessageRecieve);

        console.log('[Filter] Connected');
      }

      setIsNodeStarted(isLoaded.valueOf());

      console.log(`Node Started - Peer ID ${await peerID()}`);
      setIsPeersConnecting(false);
    };

    loadWaku();

    return () => {
      if (!isLoadedRef.current) {
        return;
      }

      stop();
    };
  }, [address]);

  const createParty = useCallback(
    async (title: string) => {
      if (!address) {
        return;
      }
      const message = new WakuMessage();
      message.contentTopic = getQRTopic(address);
      message.payload = Party.encode({
        message: title,
        address: address,
      }).finish();

      console.log(`[Message] ${title} - topic:${message.contentTopic}`);

      const x = await lightpushPublish(message);
      console.log(`[Response] - PushID ${x}`);
    },
    [address],
  );

  return (
    <context.Provider value={{nodeStarted, createParty, parties}}>
      {children}
    </context.Provider>
  );
};

export const useWaku = () => {
  const _context = useContext(context);
  if (!_context) {
    throw new Error('WakuProvider not found');
  }
  return _context;
};
