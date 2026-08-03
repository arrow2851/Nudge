@echo off
setlocal

set "APP_HOME=%~dp0"
set "WRAPPER_DIR=%APP_HOME%gradle\wrapper"
set "WRAPPER_JAR=%WRAPPER_DIR%\gradle-wrapper.jar"
set "WRAPPER_URL=https://raw.githubusercontent.com/gradle/gradle/v9.5.0/gradle/wrapper/gradle-wrapper.jar"
set "WRAPPER_SHA256=497c8c2a7e5031f6aa847f88104aa80a93532ec32ee17bdb8d1d2f67a194a9c7"

if not exist "%WRAPPER_DIR%" mkdir "%WRAPPER_DIR%"

set "DOWNLOAD_WRAPPER=false"
if not exist "%WRAPPER_JAR%" set "DOWNLOAD_WRAPPER=true"

if exist "%WRAPPER_JAR%" (
  for /f "tokens=*" %%H in ('powershell -NoProfile -Command "(Get-FileHash -Algorithm SHA256 -LiteralPath '%WRAPPER_JAR%').Hash.ToLowerInvariant()"') do set "ACTUAL_SHA256=%%H"
  if /I not "%ACTUAL_SHA256%"=="%WRAPPER_SHA256%" set "DOWNLOAD_WRAPPER=true"
)

if "%DOWNLOAD_WRAPPER%"=="true" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%.tmp'; $hash=(Get-FileHash -Algorithm SHA256 -LiteralPath '%WRAPPER_JAR%.tmp').Hash.ToLowerInvariant(); if ($hash -ne '%WRAPPER_SHA256%') { Remove-Item -Force '%WRAPPER_JAR%.tmp'; throw 'Gradle wrapper checksum verification failed.' }; Move-Item -Force '%WRAPPER_JAR%.tmp' '%WRAPPER_JAR%'"
  if errorlevel 1 exit /b 1
)

java %JAVA_OPTS% %GRADLE_OPTS% -Dorg.gradle.appname=gradlew -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
set EXIT_CODE=%ERRORLEVEL%
endlocal & exit /b %EXIT_CODE%
