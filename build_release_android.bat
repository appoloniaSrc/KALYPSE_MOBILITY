set nobuild=%1

set APK_DIR=platforms\android\build\outputs\apk
set ADT_DIR=%ANDROID_HOME%\build-tools\25.0.3
set RELEASE_KEY=kalypse-mobility.keystore
set ALIAS_NAME=Kalypse Mobility
set STORE_PASS=kalypse

REM keytool: only to generate the app key
REM call "%JAVA_HOME%\bin\keytool" -genkey -v -keystore "%RELEASE_KEY%" -alias "%ALIAS_NAME%" -keyalg RSA -keysize 2048 -validity 10000

if "%nobuild%" == "" (
    call ionic cordova build android --prod --release
)
call "%JAVA_HOME%\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore %RELEASE_KEY% -storepass %STORE_PASS% "%APK_DIR%\android-release-unsigned.apk" "%ALIAS_NAME%"
call "%ADT_DIR%\zipalign.exe" -v 4 "%APK_DIR%\android-release-unsigned.apk" "%APK_DIR%\%ALIAS_NAME%_tmp.apk"
move "%APK_DIR%\%ALIAS_NAME%_tmp.apk" "%APK_DIR%\%ALIAS_NAME%.apk"