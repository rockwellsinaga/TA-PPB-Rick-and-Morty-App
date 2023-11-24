import React from "react";
import { View, Text, Image, Button } from "react-native";
import { ScrollView } from "react-native";

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 900,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F3EE7B",
          }}
        >
          <Image
            source={{
              uri: "https://cdn.europosters.eu/image/1300/posters/rick-morty-portal-i40514.jpg",
            }}
            style={{
              width: 400,
              height: 600,
              backgroundColor: "#F3EE7B",
            }}
          />
          <Text style={{ color: "#03B0C7", padding: 15, textAlign: "justify" }}>
            "Rick and Morty" is a popular animated science fiction sitcom
            created by Justin Roiland and Dan Harmon. The show revolves around
            the adventures of the eccentric, alcoholic scientist Rick Sanchez
            and his easily influenced grandson Morty Smith. Premiering in 2013,
            the series is known for its dark humor, satirical take on science
            fiction, and intricate, mind-bending plots set across various
            dimensions and alternate realities. With clever writing and a unique
            blend of humor and philosophical concepts, "Rick and Morty" has
            become a cultural phenomenon, appealing to a diverse audience.
          </Text>
          <View style={{ margin: 10 }}>
            <Button
              title="Go to My Profile"
              onPress={() => navigation.navigate("Profile Page")}
              color="#1FA340"
            />
          </View>
          <Text style={{ color: "#03B0C7", marginBottom: 10 }}>
            Copyright © 2023 Ferdinand Rockwell Sebastian Sinaga
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
