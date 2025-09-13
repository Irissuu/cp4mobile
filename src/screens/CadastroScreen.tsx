import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BotaoTema from '../components/BotaoTema';
import BotaoIdioma from '../components/BotaoIdioma';
import BotaoGoogle from '../components/BotaoGoogle';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export default function CadastroScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signUpEmail } = useAuth();
  const { colors } = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!nome.trim()) return Alert.alert(t('signup.validateName')), false;
    if (!email.includes('@')) return Alert.alert(t('signup.validateEmail')), false;
    if (senha.length < 6) return Alert.alert(t('signup.validatePassLen')), false;
    if (senha !== confirm) return Alert.alert(t('signup.validatePassEq')), false;
    return true;
  }

  async function handle() {
    if (!validate()) return;
    try {
      setLoading(true);
      const cred = await signUpEmail(email.trim(), senha);
      if (cred?.user) {
        await updateProfile(cred.user, { displayName: nome.trim() });
        navigation.replace('Home');
      }
    } catch (e: any) {
      Alert.alert(t('signup.error'), e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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

      <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
          {t('signup.title')}
        </Text>

        <TextInput
          placeholder={t('signup.name')}
          placeholderTextColor={colors.subtext}
          value={nome}
          onChangeText={setNome}
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
          placeholder={t('signup.email')}
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
          placeholder={t('signup.password')}
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
        <TextInput
          placeholder={t('signup.confirm')}
          placeholderTextColor={colors.subtext}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
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
            {loading ? t('signup.creating') : t('signup.create')}
          </Text>
        </TouchableOpacity>

        <BotaoGoogle onSignedIn={() => navigation.replace('Home')} />

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={{ alignItems: 'center', padding: 8 }}
        >
          <Text style={{ color: colors.text }}>{t('common.backToLogin')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
