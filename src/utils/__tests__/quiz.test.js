import { buildQuizQuestions } from '../quiz';

const characters = Array.from({ length: 12 }, (_, index) => ({
  episode: Array.from({ length: index + 1 }, (__, episodeIndex) => `episode/${episodeIndex + 1}`),
  id: index + 1,
  image: `https://example.com/${index + 1}.png`,
  name: `Character ${index + 1}`,
  origin: { name: `Origin ${index + 1}` },
  species: index % 2 ? 'Alien' : 'Human',
  status: ['Alive', 'Dead', 'unknown'][index % 3],
}));

describe('quiz generator', () => {
  test('builds the requested question count across all quiz types', () => {
    const questions = buildQuizQuestions(characters, 10, () => 0.42);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((question) => question.type))).toEqual(
      new Set(['identity', 'origin', 'species', 'status', 'appearances']),
    );
  });

  test('always includes one unique correct answer in the shuffled options', () => {
    const questions = buildQuizQuestions(characters, 10, () => 0.99);

    questions.forEach((question) => {
      expect(question.options).toContain(question.correct);
      expect(new Set(question.options).size).toBe(question.options.length);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      expect(question.options.length).toBeLessThanOrEqual(4);
    });
  });
});
