import React, { useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import {
	ensureDeviceID,
	ensureLocationEnabled,
} from "./CustomFunctions/DeviceFunctions"
import {
	connectServer,
	reconnectServer,
	disconnectServer,
	helpRequestFunction,
	statusTypes,
	serverStatus,
	requestingHelp,
	setDeviceID
} from "./CustomFunctions/MyWebsocket";

export default function App() {
	useEffect(() => {
		ensureDeviceID();
		ensureLocationEnabled();
		connectServer();
		AsyncStorage.getItem("registrationStatus").then((value) => {
			setRegistrationStatus(value);
		});
		AsyncStorage.getItem("deviceID").then((value) => {
			setDeviceID(value);
		});
		// on page close, close websocket
		return () => {
			disconnectServer();
		};
	}, []);

	// when registrationStatus changes, store it in AsyncStorage
	useEffect(() => {
		AsyncStorage.setItem("registrationStatus", registrationStatus);
	}, [registrationStatus]);

	if (serverStatus != statusTypes.connectedToServer) {
		return (
			<View style={styles.container}>
				<Text onPress={reconnectServer}> {serverStatus} </Text>
			</View>
		);
	}

	if (!registrationStatus) {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						setRegistrationStatus("user");
					}}
				>
					<Text style={styles.buttonText}> Register as User </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						setRegistrationStatus("helper");
					}}
				>
					<Text style={styles.buttonText}> Register as Helper </Text>
				</TouchableOpacity>
			</View>
		);
	}
	return registrationStatus ? (
		<View style={styles.container}>
			{serverStatus == "Connected to server" ? (
				<View style={styles.greenCircle}></View>
			) : (
				<View style={styles.redCircle}></View>
			)}
			<Text onPress={reconnectServer}> {serverStatus} </Text>
			{requestingHelp ? (
				<TouchableOpacity
					style={[styles.button, styles.redButton]}
					onPress={helpRequestFunction}
				>
					<Text style={styles.buttonText}> Cancel Help </Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={styles.button}
					onPress={helpRequestFunction}
				>
					<Text style={styles.buttonText}> Request Help </Text>
				</TouchableOpacity>
			)}
			{/* {readyToHelp ? (
				<TouchableOpacity
					style={[styles.button, styles.redButton]}
					onPress={helpOfferFunction}
				>
					<Text style={styles.buttonText}> Stop Helping </Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={styles.button}
					onPress={helpOfferFunction}
				>
					<Text style={styles.buttonText}> Start Helping </Text>
				</TouchableOpacity>
			)} */}
		</View>
	) : (
		<View style={styles.container}>
			{/* register as user or helper buttons */}
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					setRegistrationStatus("user");
				}}
			>
				<Text style={styles.buttonText}> Register as User </Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					setRegistrationStatus("helper");
				}}
			>
				<Text style={styles.buttonText}> Register as Helper </Text>
			</TouchableOpacity>
		</View>
	);
}

const circleWidth = 12

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
		width: circleWidth,
		height: circleWidth,
		borderRadius: "50%",
		backgroundColor: "red",
	},
	greenCircle: {
		width: circleWidth,
		height: circleWidth,
		borderRadius: "50%",
		backgroundColor: "green",
	},
})
