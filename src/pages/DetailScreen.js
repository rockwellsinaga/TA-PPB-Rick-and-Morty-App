import React, { Component, useState, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Touchable,
} from "react-native";

function DetailScreen({ route, navigation }) {
  const { name, image, status, species, gender } = route.params;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#F3EE7B",
      }}
    >
      <ScrollView>
        <Image
          source={{ uri: image }}
          style={{
            top: 15,
            width: 360,
            height: 360,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: "#1FA340",
            backgroundColor: "#1FA340",
          }}
        />
        <Text style={styles.txtP}>Nama: {name}</Text>
        <Text style={styles.txtP}>Status: {status}</Text>
        <Text style={styles.txtP}>Species: {species}</Text>
        <Text style={styles.txtP}>Gender: {gender}</Text>
        <View style={{ margin: 50, backgroundColor: "#1FA340" }}>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color="#1FA340"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  txtP: {
    color: "#03B0C7",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    borderColor: "#000",
  },
});

export default DetailScreen;
