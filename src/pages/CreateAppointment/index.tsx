/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRoute, useNavigation } from '@react-navigation/native';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SelectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styled';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const { goBack, navigate } = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDateTimePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDateTimePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const HandleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao agendar',
        'Houve um erro na tentativa de agendamento, tente novamente.',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProviderListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(provider.id);
                }}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>

        <Calendar>
          <Title>Escolha uma data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              {!showDateTimePicker
                ? 'Abrir calendário de seleção'
                : 'Fechar calendário'}
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDateTimePicker && (
            <DateTimePicker
              {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })} // < nessa linha
              {...(Platform.OS === 'ios' && { locale: 'pt-BR' })}
              onChange={handleDateChange}
              mode="date"
              display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha um horário</Title>

          <Section>
            <SelectionTitle>Manhã</SelectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour && available}
                  available={available}
                  key={hourFormatted}
                  onPress={() => HandleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour && available}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SelectionTitle>Tarde</SelectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour && available}
                    available={available}
                    key={hourFormatted}
                    onPress={() => HandleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour && available}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
