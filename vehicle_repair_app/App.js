import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import WebSocket from "react-native-websocket";

import {
    ensureDeviceID,
    deviceID,
    ensureLocationEnabled,
    locationEnabled,
    setLocationEnabled,
    locationTest,
    setLocation,
} from "./CustomFunctions/DeviceFunctions";
import {
    serverStatus,
    requestingHelp,
    setRequestingHelp,
    readyToHelp,
    setReadyToHelp,
    requestHelp,
    startHelping,
    connectServer,
    reconnectServer,
} from "./CustomFunctions/MyWebsocket";

export default function App() {
    useEffect(() => {
        ensureDeviceID();
        ensureLocationEnabled();
        connectServer();
    }, []);
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {/* circle filled with color depending on server status */}
            <div style={serverStatus == "Connected to server" ? "green" : "red"}></div>
            <Text onPress={reconnectServer}> serverStatus </Text>
            {requestingHelp ? (
                <TouchableOpacity
                    style={[styles.button, styles.redButton]}
                    onPress={requestHelp}
                >
                    <Text style={styles.buttonText}> Cancel Help </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={requestHelp}>
                    <Text style={styles.buttonText}> Request Help </Text>
                </TouchableOpacity>
            )}
            {readyToHelp ? (
                <TouchableOpacity
                    style={[styles.button, styles.redButton]}
                    onPress={startHelping}
                >
                    <Text style={styles.buttonText}> Stop Helping </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={startHelping}>
                    <Text style={styles.buttonText}> Start Helping </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "orange",
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    redButton: {
        backgroundColor: "red",
    },
    redCircle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "red",
    },
    greenCircle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "green",
    },
});
