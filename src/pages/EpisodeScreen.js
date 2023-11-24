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

class EpisodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: "",
      dataCharacters: [],
    };
  }

  getData = () => {
    fetch(
      "https://rickandmortyapi.com/api/episode/?name=" + this.state.searchData,
      {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({ dataCharacters: json.results }, () => console.log(json))
      )
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 3 }}>
          <View
            style={{
              height: 90,
              backgroundColor: "#F3EE7B",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <TextInput
                placeholder="Cari Judul"
                onChangeText={(value) => this.setState({ searchData: value })}
                style={{
                  width: 200,
                  borderBottomColor: "#03B0C7",
                  marginVertical: 8,
                  marginHorizontal: 20,
                  paddingHorizontal: 10,
                  borderBottomWidth: 1,
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#1FA340",
                  paddingHorizontal: 15,
                  paddingVertical: 13,
                  borderRadius: 10,
                  elevation: 5,
                }}
                onPress={() => this.getData()}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#1FA340" }}
            data={this.state.dataCharacters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  margin: 10,
                  backgroundColor: "#000",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text style={{ color: "#03B0C7", alignSelf: "center" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#03B0C7", alignSelf: "center" }}>
                  {item.episode}
                </Text>
              </View>
            )}
          ></FlatList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    height: 120,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 15,
    padding: 10,
  },
  list: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EpisodeScreen;
