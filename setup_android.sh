#!/bin/bash
set -e

echo "Starting Android SDK setup..."

# Directories
SDK_DIR="$HOME/Library/Android/sdk"
CMDLINE_DIR="$SDK_DIR/cmdline-tools/latest"
JDK_DIR="$HOME/jdk-17"

mkdir -p "$SDK_DIR"
mkdir -p "$CMDLINE_DIR"

# 1. Download and extract OpenJDK 17
if [ ! -d "$JDK_DIR/Contents/Home" ]; then
    echo "Downloading OpenJDK 17..."
    /usr/bin/curl -L -k -o /tmp/jdk17.tar.gz "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_aarch64_mac_hotspot_17.0.10_7.tar.gz"
    echo "Extracting OpenJDK 17..."
    tar -xzf /tmp/jdk17.tar.gz -C /tmp/
    mv /tmp/jdk-17.0.10+7/* "$JDK_DIR/" || mv /tmp/jdk-17* "$JDK_DIR/"
fi

export JAVA_HOME="$JDK_DIR/Home"
export PATH="$JAVA_HOME/bin:$PATH"

# 2. Download and extract Android Command Line Tools
if [ ! -f "$CMDLINE_DIR/bin/sdkmanager" ]; then
    echo "Downloading Android Command Line Tools..."
    # URL for Mac command line tools (latest as of early 2024)
    /usr/bin/curl -L -k -o /tmp/cmdline-tools.zip "https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip"
    echo "Extracting Android Command Line Tools..."
    unzip -q /tmp/cmdline-tools.zip -d /tmp/
    mv /tmp/cmdline-tools/* "$CMDLINE_DIR/"
fi

export ANDROID_HOME="$SDK_DIR"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

# 3. Accept licenses and install packages
echo "Installing Android SDK packages..."
yes | "$CMDLINE_DIR/bin/sdkmanager" --licenses > /dev/null 2>&1
"$CMDLINE_DIR/bin/sdkmanager" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "Android setup complete!"
