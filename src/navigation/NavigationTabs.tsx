import { useEffect } from 'react';

import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import useItemCountInCart from '@/hooks/use-item-count-in-cart';

import type { PropsWithNavigation } from '@/navigation/NavigationStack';
import { closeProductItem } from '@/slices/ui';
import { useAppDispatch, useAppSelector } from '@/store';
import CartScreen from '@/views/CartScreen';
import OrderHistoryScreen from '@/views/OrderHistoryScreen';
import OrderScreen from '@/views/OrderScreen';
import OrderStatusScreen from '@/views/OrderStatusScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions, useNavigationState } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const USE_PAPER_NAVIGATION = true;

const NavigationTabs: FC<PropsWithNavigation> = ({ navigation: nav }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const itemsInCart = useItemCountInCart();

    const hasCurrentSession = useAppSelector(
        state => state.persisted.currentSession !== null,
    );

    useEffect(() => {
        if (!hasCurrentSession) {
            nav.navigate('StartScreen');
        }
    }, [hasCurrentSession, nav]);

    const screenName = useNavigationState(
        state => state.routes[state.index].name,
    );

    // hack
    useEffect(() => {
        if (screenName) {
            dispatch(closeProductItem());
        }
    }, [dispatch, screenName]);

    return (
        <>
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
                                      descriptors[
                                          route.key
                                      ].options.tabBarIcon?.({
                                          focused,
                                          color,
                                          size: 24,
                                      }) || null
                                  }
                                  getLabelText={({ route }) => {
                                      const { options } =
                                          descriptors[route.key];
                                      return typeof options.tabBarLabel ===
                                          'string'
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
                        tabBarLabel: t('navigation.orderScreen'),
                        tabBarIcon: ({ color, size }) => (
                            <Icon source="food" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="CartScreen"
                    component={CartScreen}
                    options={{
                        tabBarLabel: itemsInCart
                            ? t('navigation.cartScreenWithItems', {
                                  count: itemsInCart,
                              })
                            : t('navigation.cartScreen'),
                        tabBarIcon: ({ color, size }) => (
                            <Icon source="cart" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="OrderStatusScreen"
                    component={OrderStatusScreen}
                    options={{
                        tabBarLabel: t('navigation.orderStatusScreen'),
                        tabBarIcon: ({ color, size }) => (
                            <Icon
                                source="list-status"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="OrderHistoryScreen"
                    component={OrderHistoryScreen}
                    options={{
                        tabBarLabel: t('navigation.orderHistoryScreen'),
                        tabBarIcon: ({ color, size }) => (
                            <Icon source="history" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    );
};

export default NavigationTabs;
