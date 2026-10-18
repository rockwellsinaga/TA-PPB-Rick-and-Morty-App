const shuffle = (items, random = Math.random) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
};

const uniqueOptions = (correct, alternatives, random) => {
  const distractors = alternatives
    .filter((item) => item && item !== correct)
    .filter((item, index, array) => array.indexOf(item) === index);

  return shuffle([correct, ...shuffle(distractors, random).slice(0, 3)], random);
};

export const buildQuizQuestions = (characters, count = 10, random = Math.random) => {
  const pool = shuffle(characters, random);
  const types = ['identity', 'origin', 'species', 'status', 'appearances'];

  return pool.slice(0, count).map((character, index) => {
    const type = types[index % types.length];
    const others = pool.filter((item) => item.id !== character.id);
    let prompt;
    let correct;
    let alternatives;

    if (type === 'origin') {
      prompt = `Where does ${character.name} originate?`;
      correct = character.origin?.name || 'unknown';
      alternatives = others.map((item) => item.origin?.name || 'unknown');
    } else if (type === 'species') {
      prompt = `What species is ${character.name}?`;
      correct = character.species;
      alternatives = others.map((item) => item.species);
    } else if (type === 'status') {
      prompt = `What is ${character.name}'s status?`;
      correct = character.status;
      alternatives = ['Alive', 'Dead', 'unknown'];
    } else if (type === 'appearances') {
      prompt = `How many episodes feature ${character.name}?`;
      correct = String(character.episode.length);
      alternatives = others.map((item) => String(item.episode.length));
    } else {
      prompt = 'Identify this multiverse specimen.';
      correct = character.name;
      alternatives = others.map((item) => item.name);
    }

    return {
      character,
      correct,
      id: `${character.id}-${type}`,
      options: uniqueOptions(correct, alternatives, random),
      prompt,
      type,
    };
  });
};
