// Módulos
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importação de páginas

import Dashboard from '../pages/Dashboard';

// Instâncias

const App = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <>
      <App.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#312e38' },
        }}
      >
        <App.Screen name="Dashboard" component={Dashboard} />
      </App.Navigator>
    </>
  );
};

export default AppRoutes;
