import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import { auth } from '../services/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  webClientIdOverride?: string;
  androidClientIdOverride?: string;
  onSignedIn?: () => void; // opcional
};

export default function BotaoGoogle({
  webClientIdOverride,
  androidClientIdOverride,
  onSignedIn,
}: Props) {
  const { t } = useTranslation();

  const extra: any =
    (Constants.expoConfig?.extra || (Constants as any).manifest?.extra) ?? {};
  const webClientId: string =
    webClientIdOverride || extra.googleWebClientId || '';
  const androidClientId: string =
    androidClientIdOverride || extra.googleAndroidClientId || '';

  const nativeScheme =
    androidClientId && androidClientId.includes('.apps.googleusercontent.com')
      ? `com.googleusercontent.apps.${androidClientId.replace(
          '.apps.googleusercontent.com',
          '',
        )}`
      : undefined;

  const redirectUri = makeRedirectUri({
    native: nativeScheme ? `${nativeScheme}:/oauthredirect` : undefined,
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId || undefined,          
    androidClientId: androidClientId || undefined,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = (response.params as any)?.id_token;
    if (!idToken) return;

    const cred = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, cred).then(() => {
      onSignedIn?.();
    });
  }, [response]);

  return (
    <Pressable
      disabled={!request}
      onPress={() => promptAsync()}
      style={{
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        opacity: request ? 1 : 0.6,
      }}
    >
      <AntDesign name="google" size={20} color="#fff" style={{ marginRight: 8 }} />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
        {t('auth.continueWithGoogle')}
      </Text>
    </Pressable>
  );
}
