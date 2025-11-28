/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

import 'moment/locale/en-gb';
import './src/translations';

AppRegistry.registerComponent(appName, () => App);
