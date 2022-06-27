// File generated by FlutterFire CLI.
// ignore_for_file: lines_longer_than_80_chars
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError(
        'DefaultFirebaseOptions have not been configured for web - '
        'you can reconfigure this by running the FlutterFire CLI again.',
      );
    }
    // ignore: missing_enum_constant_in_switch
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
    }

    throw UnsupportedError(
      'DefaultFirebaseOptions are not supported for this platform.',
    );
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyD5Upxz6CM2T8glsgtoH_YtG9inPPzx3j8',
    appId: '1:497922787740:android:a8d02f49a7efd1df836059',
    messagingSenderId: '497922787740',
    projectId: 'hoseo-notice',
    storageBucket: 'hoseo-notice.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyCyEXzYNqutANOKrgl6rIfsSmEVR8PDJvI',
    appId: '1:497922787740:ios:ddb75cdd54c9db62836059',
    messagingSenderId: '497922787740',
    projectId: 'hoseo-notice',
    storageBucket: 'hoseo-notice.appspot.com',
    iosClientId: '497922787740-v4pofk072g4mb0ais05fmfoh1o6eb7mo.apps.googleusercontent.com',
    iosBundleId: 'com.irlab.hoseoNotice',
  );
}
