import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 120 : 40}px;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: ${getStatusBarHeight() + 30}px; ;
`;

export const UserAvatarButton = styled(RectButton)`
  margin-top: 10px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;

  align-self: center;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 45px 0 24px;
  text-align: left;
`;

export const ExitButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
