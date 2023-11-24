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

function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/", {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-star",
        backgroundColor: "#F3EE7B",
      }}
    >
      <View
        style={{ height: 50, backgroundColor: "#F3EE7B", alignItems: "center" }}
      >
        <Text style={{ color: "#03B0C7", fontWeight: "bold", fontSize: 24 }}>
          Rick and Morty App
        </Text>
      </View>

      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Detail Page", item);
            }}
            style={{ margin: 10 }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 300,
                height: 300,
                borderWidth: 5,
                borderRadius: 300,
                borderColor: "#1FA340",
                resizeMode: "contain",
                backgroundColor: "#1FA340",
              }}
            />
            <Text
              style={{
                color: "#03B0C7",
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                marginTop: 0,
                backgroundColor: "#F3EE7B",
              }}
            >
              {" "}
              {item.name}
            </Text>
            <Text
              style={{
                color: "#03B0C7",
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 0,
                backgroundColor: "#F3EE7B",
              }}
            >
              {" "}
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default HomeScreen;
