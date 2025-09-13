import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BotaoTema from '../components/BotaoTema';
import BotaoIdioma from '../components/BotaoIdioma';
import BotaoGoogle from '../components/BotaoGoogle';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signInEmail } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handle() {
    try {
      setLoading(true);
      await signInEmail(email.trim(), senha);
    } catch (e: any) {
      Alert.alert(t('login.error'), e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        gap: 10,
        backgroundColor: colors.bg,
      }}
    >
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          right: 16,
          top: 12,
          zIndex: 200,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <BotaoIdioma />
        <BotaoTema />
      </View>

      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
        {t('login.title')}
      </Text>

      <TextInput
        placeholder={t('login.email')}
        placeholderTextColor={colors.subtext}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: colors.input,
          color: colors.text,
          borderRadius: 10,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      />

      <TextInput
        placeholder={t('login.password')}
        placeholderTextColor={colors.subtext}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{
          backgroundColor: colors.input,
          color: colors.text,
          borderRadius: 10,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      />

      <TouchableOpacity
        onPress={handle}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: colors.primaryText, fontWeight: '800' }}>
          {loading ? '...' : t('login.enter')}
        </Text>
      </TouchableOpacity>

      <BotaoGoogle onSignedIn={() => {  }} />

      <TouchableOpacity
        onPress={() => navigation.replace('Cadastro')}
        style={{ alignItems: 'center', padding: 8 }}
      >
        <Text style={{ color: colors.text }}>{t('login.createAccount')}</Text>
      </TouchableOpacity>
    </View>
  );
}
