import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import CartScreen from '@/views/CartScreen';
import OrderHistoryScreen from '@/views/OrderHistoryScreen';
import OrderScreen from '@/views/OrderScreen';
import OrderStatusScreen from '@/views/OrderStatusScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const USE_PAPER_NAVIGATION = true;

const NavigationTabs: FC = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                headerTitle: '',
                headerTransparent: true,
            }}
            tabBar={
                !USE_PAPER_NAVIGATION
                    ? undefined
                    : ({ navigation, state, descriptors, insets }) => (
                          <BottomNavigation.Bar
                              navigationState={state}
                              safeAreaInsets={insets}
                              activeColor={theme.colors.primary}
                              onTabPress={({ route, preventDefault }) => {
                                  const event = navigation.emit({
                                      type: 'tabPress',
                                      target: route.key,
                                      canPreventDefault: true,
                                  });

                                  if (event.defaultPrevented) {
                                      preventDefault();
                                  } else {
                                      navigation.dispatch({
                                          ...CommonActions.navigate(
                                              route.name,
                                              route.params,
                                          ),
                                          target: state.key,
                                      });
                                  }
                              }}
                              renderIcon={({ route, focused, color }) =>
                                  descriptors[route.key].options.tabBarIcon?.({
                                      focused,
                                      color,
                                      size: 24,
                                  }) || null
                              }
                              getLabelText={({ route }) => {
                                  const { options } = descriptors[route.key];
                                  return typeof options.tabBarLabel === 'string'
                                      ? options.tabBarLabel
                                      : typeof options.title === 'string'
                                        ? options.title
                                        : route.name;
                              }}
                          />
                      )
            }
        >
            <Tab.Screen
                name="OrderScreen"
                component={OrderScreen}
                options={{
                    tabBarLabel: 'Order',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="food" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="CartScreen"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="cart" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="OrderStatusScreen"
                component={OrderStatusScreen}
                options={{
                    tabBarLabel: 'Status',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="list-status" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="OrderHistoryScreen"
                component={OrderHistoryScreen}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="history" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default NavigationTabs;
