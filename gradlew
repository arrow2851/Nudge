#!/usr/bin/env sh

set -eu

APP_HOME=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WRAPPER_DIR="$APP_HOME/gradle/wrapper"
WRAPPER_JAR="$WRAPPER_DIR/gradle-wrapper.jar"
WRAPPER_URL="https://raw.githubusercontent.com/gradle/gradle/v9.5.0/gradle/wrapper/gradle-wrapper.jar"
WRAPPER_SHA256="497c8c2a7e5031f6aa847f88104aa80a93532ec32ee17bdb8d1d2f67a194a9c7"

checksum() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | awk '{print $1}'
    elif command -v shasum >/dev/null 2>&1; then
        shasum -a 256 "$1" | awk '{print $1}'
    else
        echo "A SHA-256 utility is required (sha256sum or shasum)." >&2
        exit 1
    fi
}

install_wrapper() {
    mkdir -p "$WRAPPER_DIR"
    temporary="$WRAPPER_JAR.tmp"
    rm -f "$temporary"

    if command -v curl >/dev/null 2>&1; then
        curl --fail --location --retry 3 --output "$temporary" "$WRAPPER_URL"
    elif command -v wget >/dev/null 2>&1; then
        wget --tries=3 --output-document="$temporary" "$WRAPPER_URL"
    else
        echo "curl or wget is required to bootstrap the Gradle wrapper." >&2
        exit 1
    fi

    actual=$(checksum "$temporary")
    if [ "$actual" != "$WRAPPER_SHA256" ]; then
        rm -f "$temporary"
        echo "Gradle wrapper checksum verification failed." >&2
        exit 1
    fi

    mv "$temporary" "$WRAPPER_JAR"
}

if [ ! -f "$WRAPPER_JAR" ] || [ "$(checksum "$WRAPPER_JAR")" != "$WRAPPER_SHA256" ]; then
    install_wrapper
fi

exec java ${JAVA_OPTS:-} ${GRADLE_OPTS:-} \
    -Dorg.gradle.appname=gradlew \
    -classpath "$WRAPPER_JAR" \
    org.gradle.wrapper.GradleWrapperMain "$@"
