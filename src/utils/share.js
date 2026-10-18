import { Share } from 'react-native';

const labels = {
  character: 'character',
  location: 'location',
  episode: 'episode',
};

export const shareResource = (resourceType, item) =>
  Share.share({
    title: item.name,
    message: `I found ${item.name} in The Ultimate Rick & Morty Explorer. Explore this ${labels[resourceType]}: ${item.url}`,
    url: item.url,
  });
