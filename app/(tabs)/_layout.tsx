import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      
      {/* Home Screen */}
      <Tabs.Screen
        name="homescreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      
      {/* Meal Rate Screen */}
      <Tabs.Screen
        name="meal_rate"
        options={{
          title: 'Meal Rate',
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon name={focused ? 'fast-food' : 'fast-food-outline'} color={color} />
          // ),

          tabBarButton: () => null,
        }}
      />
      
      {/* Meal Form Screen */}
      <Tabs.Screen
        name="MealForm"
        options={{
          title: 'Meal Form',
          tabBarButton: () => null,  // Hides the screen from the tab bar
        }}
      />

<Tabs.Screen
        name="wallet"
        options={{
          title: 'Meal Form',
          tabBarButton: () => null,  // Hides the screen from the tab bar
        }}
      />
      
      {/* Meal Screen */}
      <Tabs.Screen
        name="MealScreen"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'restaurant' : 'restaurant-outline'} color={color} />
          ),
        }}
      />
      
      {/* Spend Screen */}
      <Tabs.Screen
        name="SpendScreen"
        options={{
          title: 'Spend',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
          ),
        }}
      />
      
      {/* Users Screen */}
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      
      {/* Wallet Screen */}
      <Tabs.Screen
        name="overall_calculation"
        options={{
          title: 'My Calculation',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="deposit"
        options={{
          title: 'Deposit',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart'} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
