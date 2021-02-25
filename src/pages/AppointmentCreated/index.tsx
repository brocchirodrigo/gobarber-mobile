/* eslint-disable import/no-duplicates */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/Feather';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styled';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR },
    );
  }, [routeParams.date]);

  const { reset } = useNavigation();
  const handleOkPress = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento realizado!</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPress}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
