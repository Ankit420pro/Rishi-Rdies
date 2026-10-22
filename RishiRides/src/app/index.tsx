
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuthenticatedSession, type AuthenticatedSession } from '../api/session';

export default function Index() {
  const [session, setSession] = useState<AuthenticatedSession | null | undefined>();

  useEffect(() => {
    getAuthenticatedSession().then(setSession).catch(() => setSession(null));
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
}
