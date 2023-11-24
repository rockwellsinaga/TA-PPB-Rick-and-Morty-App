import React, { useState, useEffect } from "react";
import { Text, Image, View, TouchableOpacity, Linking } from "react-native";

export default function ProfileScreen() {
  const [githubData, setGithubData] = useState({});

  const getGithubData = async () => {
    const response = await fetch("https://api.github.com/users/rockwellsinaga");
    const data = await response.json();
    setGithubData(data);
  };

  useEffect(() => {
    getGithubData();
  }, []);

  const instagramUsername = "rockwellsinaga"; // Replace with your Instagram username
  const youtubeUsername = "UCt4R31oTbS8cz2k3ZHKsGNw"; // Replace with your YouTube username

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: githubData.avatar_url,
          }}
          style={{ borderRadius: 150, width: 300, height: 300 }}
        />
        {githubData.name && <Text>{githubData.name}</Text>}
        {githubData.login && <Text>{githubData.login}</Text>}

        <View style={styles.logoContainer}>
          {githubData.html_url && (
            <TouchableOpacity
              onPress={() => Linking.openURL(githubData.html_url)}
            >
              <Image
                source={require("../../assets/github.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
          )}
          {instagramUsername && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://www.instagram.com/${instagramUsername}`
                )
              }
            >
              <Image
                source={require("../../assets/instagram.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
          )}
          {youtubeUsername && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://www.youtube.com/channel/${youtubeUsername}`
                )
              }
            >
              <Image
                source={require("../../assets/youtube.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3EE7B",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
};
