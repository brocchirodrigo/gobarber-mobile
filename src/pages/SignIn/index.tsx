/* eslint-disable no-console */
import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';

import { useAuth } from '../../hooks/Auth';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  ButtonForgotPass,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

import logoImg from '../../assets/Logo/logo.png';
import getValidateErrors from '../../utils/getValidationErros';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const passwordInputRef = useRef(null);
  const formRef = useRef<FormHandles>(null);
  const Navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = yup.object().shape({
          email: yup
            .string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors = getValidateErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          Alert.alert(
            'Erro na autenticação',
            'Ocorreu um erro ao fazer login, cheque as credenciais.',
          );
        }
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handleSignIn}
            >
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
            <ButtonForgotPass>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ButtonForgotPass>
          </Container>
        </ScrollView>

        <CreateAccountButton onPress={() => Navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      </KeyboardAvoidingView>
    </>
  );
};
