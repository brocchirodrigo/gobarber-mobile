/* eslint-disable no-console */
import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import logoImg from '../../assets/Logo/logo.png';

import getValidateErrors from '../../utils/getValidationErros';

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

export const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const Navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = yup.object().shape({
        name: yup.string().required('Nome obrigatório'),
        email: yup
          .string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: yup.string().min(6, 'Mínimo de 6 digitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert('Cadastro realizado com sucesso', 'Você já pode fazer login');

      Navigation.navigate('SignIn');
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidateErrors(err);

        formRef.current?.setErrors(errors);
      }

      Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer o cadastro');
    }
  }, []);

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
              <Title>Crie sua conta</Title>
            </View>

            <Form
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
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
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>

        <BackToSignIn onPress={() => Navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      </KeyboardAvoidingView>
    </>
  );
};
