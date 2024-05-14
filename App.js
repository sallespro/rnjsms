import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  NativeModules,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';

// SMS package
// https://ajayts7.medium.com/z-1bc0cbd5d00c

const App = () => {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');
  const [Sms, setSms] = useState('');

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestSmsPermission();
  }, []);

  useEffect(() => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const { messageBody, senderPhoneNumber } = JSON.parse(message);

          setSms(`Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`)

        },
      );

      return () => {
        //subscriber.remove();
      };
    }
  }, [receiveSmsPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Listen to incoming SMS
        </Text>
        <Text style={styles.titleText}>
          {Sms}
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
