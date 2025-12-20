import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sport"
        options={{
          title: 'Sport',
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: 'Culture',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="others"
        options={{
          title: 'Others',
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
