## Devnotes

### react-native-bootsplash

Because the library generates a splashscreen from a logo instead of using the already generated splashscreen image, the
files are modified to fit our needs.

This means that when (re-)generating the files, manual changes must be made afterwards.

### Todo

- Built-In notifications
  - https://docs.page/invertase/notifee/react-native/environment-support
  - Send a notification if the user is not doing anything in the app for more than 5 minutes and is in a session
