import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { colors, fonts } from '../theme';

export default function RelationshipGraph({ centerCharacter, connections, onPressCharacter }) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth - 36, 680);
  const height = Math.min(410, Math.max(340, width * 0.66));
  const center = { x: width / 2, y: height / 2 };
  const radiusX = Math.max(115, width * 0.37);
  const radiusY = Math.max(112, height * 0.36);
  const nodeSize = width < 430 ? 58 : 68;
  const positions = connections.map((connection, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / connections.length;
    return {
      ...connection,
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
    };
  });

  return (
    <View style={[styles.graph, { height, width }]}>
      <Svg height={height} style={StyleSheet.absoluteFill} width={width}>
        <Circle cx={center.x} cy={center.y} fill="#c7ff4a0d" r={70} stroke={colors.portal} strokeOpacity={0.35} strokeWidth={1} />
        {positions.map((node) => (
          <Line
            key={node.character.id}
            stroke={colors.cyan}
            strokeOpacity={Math.min(0.8, 0.22 + node.appearances * 0.035)}
            strokeWidth={Math.min(5, 1 + node.appearances * 0.15)}
            x1={center.x}
            x2={node.x}
            y1={center.y}
            y2={node.y}
          />
        ))}
      </Svg>

      <Pressable
        onPress={() => onPressCharacter(centerCharacter)}
        style={[styles.centerNode, { left: center.x - 44, top: center.y - 44 }]}
      >
        <Image source={{ uri: centerCharacter.image }} style={styles.centerImage} />
      </Pressable>

      {positions.map((node) => (
        <Pressable
          key={node.character.id}
          onPress={() => onPressCharacter(node.character)}
          style={[styles.node, { height: nodeSize, left: node.x - nodeSize / 2, top: node.y - nodeSize / 2, width: nodeSize }]}
        >
          <Image source={{ uri: node.character.image }} style={styles.nodeImage} />
          <View style={styles.nodeBadge}><Text style={styles.nodeCount}>{node.appearances}</Text></View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  graph: { alignSelf: 'center', overflow: 'hidden', position: 'relative' },
  centerNode: { borderColor: colors.portal, borderRadius: 46, borderWidth: 3, height: 88, overflow: 'hidden', position: 'absolute', width: 88 },
  centerImage: { height: '100%', width: '100%' },
  node: { borderColor: colors.cyan, borderRadius: 999, borderWidth: 2, overflow: 'visible', position: 'absolute' },
  nodeImage: { borderRadius: 999, height: '100%', width: '100%' },
  nodeBadge: { alignItems: 'center', backgroundColor: colors.cyan, borderRadius: 12, bottom: -5, height: 23, justifyContent: 'center', position: 'absolute', right: -5, width: 23 },
  nodeCount: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 10 },
});
