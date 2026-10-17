
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuthSession, type AuthSession } from '../api/auth-session';

export default function Index() {
<<<<<<< HEAD
  const [session, setSession] = useState<AuthSession | null | undefined>();

  useEffect(() => {
    getAuthSession().then(setSession).catch(() => setSession(null));
  }, []);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#071713' }}>
        <ActivityIndicator color="#9BE8C5" />
      </View>
    );
  }

  if (!session) return <Redirect href="/landing" />;
  return (
    <Redirect
      href={session.role === 'driver'
        ? '/dashboards/Drivers/driver-dashboard'
        : '/dashboards/passenger/passenger-dashboard'}
    />
  );
=======
  return <Redirect href="/landing" />;
>>>>>>> origin/main
}
