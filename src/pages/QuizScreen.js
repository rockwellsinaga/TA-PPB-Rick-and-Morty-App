import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchCharacters, fetchResourcesByIds } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import { LoadingState, MessageState } from '../components/ScreenState';
import { buildQuizQuestions } from '../utils/quiz';
import { errorFeedback, selectionFeedback, successFeedback } from '../utils/feedback';
import { colors, fonts, gradients, layout } from '../theme';

const HIGH_SCORE_KEY = '@ultimate-rick-and-morty/quiz-high-score';

const getRandomIds = (total, count) => {
  const ids = new Set();
  while (ids.size < Math.min(total, count)) ids.add(Math.floor(Math.random() * total) + 1);
  return [...ids];
};

export default function QuizScreen() {
  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY)
      .then((value) => value && setHighScore(Number(value)))
      .catch(() => {});
  }, []);

  const startQuiz = async () => {
    selectionFeedback();
    setPhase('loading');
    setError(null);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    try {
      const firstPage = await fetchCharacters();
      const contestants = await fetchResourcesByIds('character', getRandomIds(firstPage.info.count, 18));
      setQuestions(buildQuizQuestions(contestants));
      setPhase('playing');
    } catch (requestError) {
      setError(requestError.message);
      setPhase('error');
    }
  };

  const answer = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === questions[index].correct) {
      const nextStreak = streak + 1;
      setScore((current) => current + 1);
      setStreak(nextStreak);
      setBestStreak((current) => Math.max(current, nextStreak));
      successFeedback();
    } else {
      setStreak(0);
      errorFeedback();
    }
  };

  const nextQuestion = () => {
    selectionFeedback();
    if (index + 1 < questions.length) {
      setIndex((current) => current + 1);
      setSelected(null);
      return;
    }
    const nextHighScore = Math.max(highScore, score);
    setHighScore(nextHighScore);
    AsyncStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore)).catch(() => {});
    setPhase('finished');
  };

  if (phase === 'loading') {
    return <View style={styles.screen}><AmbientBackground /><LoadingState label="Charging the Brainalyzer..." /></View>;
  }

  if (phase === 'error') {
    return <View style={styles.screen}><AmbientBackground /><MessageState actionLabel="Retry" message={error} onAction={startQuiz} title="Brainalyzer malfunction" /></View>;
  }

  if (phase === 'intro') {
    return (
      <View style={styles.screen}>
        <AmbientBackground />
        <ScrollView contentContainerStyle={styles.introContent}>
          <View style={styles.brainIcon}><Ionicons color={colors.violet} name="game-controller" size={58} /></View>
          <Text style={styles.eyebrow}>CITADEL KNOWLEDGE TEST</Text>
          <Text style={styles.title}>The{`\n`}Brainalyzer</Text>
          <Text style={styles.subtitle}>Ten randomized questions. Five categories. One very questionable measure of interdimensional intelligence.</Text>
          <View style={styles.rules}>
            {[
              ['images-outline', 'Identity', 'Recognize characters from their portraits.'],
              ['navigate-outline', 'Origins', 'Match specimens to their original dimensions.'],
              ['analytics-outline', 'Facts', 'Species, status, and episode appearances.'],
            ].map(([icon, title, copy]) => (
              <View key={title} style={styles.ruleRow}>
                <View style={styles.ruleIcon}><Ionicons color={colors.cyan} name={icon} size={20} /></View>
                <View style={styles.ruleCopy}><Text style={styles.ruleTitle}>{title}</Text><Text style={styles.ruleText}>{copy}</Text></View>
              </View>
            ))}
          </View>
          <View style={styles.highScore}><Text style={styles.highScoreLabel}>CURRENT HIGH SCORE</Text><Text style={styles.highScoreValue}>{highScore}/10</Text></View>
          <Pressable onPress={startQuiz} style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
            <LinearGradient colors={gradients.portal} style={styles.startGradient}>
              <Text style={styles.startText}>Start the experiment</Text><Ionicons color={colors.ink} name="arrow-forward" size={21} />
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.screen}>
        <AmbientBackground />
        <ScrollView contentContainerStyle={styles.finishedContent}>
          <View style={styles.resultRing}><Text style={styles.resultValue}>{percentage}%</Text></View>
          <Text style={styles.resultKicker}>EXPERIMENT COMPLETE</Text>
          <Text style={styles.resultTitle}>{score >= 8 ? 'Certified genius.' : score >= 5 ? 'Acceptably dimensional.' : 'Jerry-level readings.'}</Text>
          <Text style={styles.resultText}>You answered {score} of {questions.length} correctly with a best streak of {bestStreak}.</Text>
          <View style={styles.resultStats}>
            <View style={styles.resultStat}><Text style={styles.resultStatValue}>{score}</Text><Text style={styles.resultStatLabel}>Correct</Text></View>
            <View style={styles.resultStat}><Text style={styles.resultStatValue}>{bestStreak}</Text><Text style={styles.resultStatLabel}>Best streak</Text></View>
            <View style={styles.resultStat}><Text style={styles.resultStatValue}>{highScore}</Text><Text style={styles.resultStatLabel}>High score</Text></View>
          </View>
          <Pressable onPress={startQuiz} style={styles.againButton}><Ionicons color={colors.ink} name="refresh" size={20} /><Text style={styles.againText}>Generate a new quiz</Text></Pressable>
        </ScrollView>
      </View>
    );
  }

  const question = questions[index];
  const answeredCorrectly = selected === question.correct;

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.quizContent}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>QUESTION {index + 1} / {questions.length}</Text>
          <View style={styles.streakPill}><Ionicons color={colors.warning} name="flame" size={16} /><Text style={styles.streakText}>{streak} streak</Text></View>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressBar, { width: `${((index + 1) / questions.length) * 100}%` }]} /></View>

        <View style={styles.questionCard}>
          <Image source={{ uri: question.character.image }} style={styles.questionImage} />
          <Text style={styles.questionType}>{question.type.toUpperCase()}</Text>
          <Text style={styles.questionText}>{question.prompt}</Text>
        </View>

        <View style={styles.answers}>
          {question.options.map((option, optionIndex) => {
            const isCorrect = selected && option === question.correct;
            const isWrong = selected === option && option !== question.correct;
            return (
              <Pressable
                disabled={Boolean(selected)}
                key={option}
                onPress={() => answer(option)}
                style={[styles.answer, isCorrect && styles.answerCorrect, isWrong && styles.answerWrong]}
              >
                <Text style={styles.answerLetter}>{String.fromCharCode(65 + optionIndex)}</Text>
                <Text style={styles.answerText}>{option}</Text>
                {isCorrect ? <Ionicons color={colors.ink} name="checkmark-circle" size={21} /> : null}
                {isWrong ? <Ionicons color={colors.text} name="close-circle" size={21} /> : null}
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View style={[styles.feedback, answeredCorrectly ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackTitle}>{answeredCorrectly ? 'Correct signal!' : 'Timeline mismatch'}</Text>
            <Text style={styles.feedbackText}>{answeredCorrectly ? 'Your dimensional knowledge remains intact.' : `The correct answer is ${question.correct}.`}</Text>
            <Pressable onPress={nextQuestion} style={styles.nextButton}>
              <Text style={styles.nextText}>{index + 1 === questions.length ? 'See results' : 'Next question'}</Text>
              <Ionicons color={colors.ink} name="arrow-forward" size={19} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  introContent: { alignItems: 'center', alignSelf: 'center', maxWidth: 700, padding: 22, paddingBottom: 110, width: '100%' },
  brainIcon: { alignItems: 'center', backgroundColor: '#a98cff15', borderColor: colors.violet, borderRadius: 58, borderWidth: 1, height: 116, justifyContent: 'center', marginTop: 16, width: 116 },
  eyebrow: { color: colors.violet, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, marginTop: 22 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 39, lineHeight: 45, marginTop: 9, textAlign: 'center' },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 520, textAlign: 'center' },
  rules: { alignSelf: 'stretch', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 21, borderWidth: 1, gap: 13, marginTop: 24, padding: 16 },
  ruleRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  ruleIcon: { alignItems: 'center', backgroundColor: '#46e6e612', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  ruleCopy: { flex: 1 },
  ruleTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 13 },
  ruleText: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  highScore: { alignItems: 'center', marginTop: 22 },
  highScoreLabel: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.5 },
  highScoreValue: { color: colors.warning, fontFamily: fonts.displayHeavy, fontSize: 27, marginTop: 4 },
  startButton: { alignSelf: 'stretch', borderRadius: 15, marginTop: 17, overflow: 'hidden' },
  startGradient: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  startText: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 15 },
  pressed: { opacity: 0.76 },
  quizContent: { alignSelf: 'center', maxWidth: 720, padding: 18, paddingBottom: 110, width: '100%' },
  progressHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  progressLabel: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.3 },
  streakPill: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 999, flexDirection: 'row', gap: 5, paddingHorizontal: 10, paddingVertical: 6 },
  streakText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 10 },
  progressTrack: { backgroundColor: colors.surfaceBright, borderRadius: 999, height: 6, marginTop: 12, overflow: 'hidden' },
  progressBar: { backgroundColor: colors.portal, borderRadius: 999, height: '100%' },
  questionCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, marginTop: 20, overflow: 'hidden', paddingBottom: 23 },
  questionImage: { aspectRatio: 1.65, width: '100%' },
  questionType: { color: colors.violet, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.5, marginTop: 19 },
  questionText: { color: colors.text, fontFamily: fonts.display, fontSize: 19, lineHeight: 27, marginTop: 7, paddingHorizontal: 18, textAlign: 'center' },
  answers: { gap: 10, marginTop: 16 },
  answer: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 12, minHeight: 58, padding: 12 },
  answerCorrect: { backgroundColor: colors.portal, borderColor: colors.portal },
  answerWrong: { backgroundColor: colors.danger, borderColor: colors.danger },
  answerLetter: { color: colors.muted, fontFamily: fonts.display, fontSize: 12, width: 22 },
  answerText: { color: colors.text, flex: 1, fontFamily: fonts.bodyBold, fontSize: 14 },
  feedback: { borderRadius: 18, marginTop: 16, padding: 16 },
  feedbackCorrect: { backgroundColor: '#c7ff4a16', borderColor: colors.portal, borderWidth: 1 },
  feedbackWrong: { backgroundColor: '#ff657716', borderColor: colors.danger, borderWidth: 1 },
  feedbackTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 15 },
  feedbackText: { color: colors.muted, fontFamily: fonts.body, marginTop: 5 },
  nextButton: { alignItems: 'center', alignSelf: 'flex-end', backgroundColor: colors.portal, borderRadius: 12, flexDirection: 'row', gap: 8, marginTop: 14, paddingHorizontal: 14, paddingVertical: 11 },
  nextText: { color: colors.ink, fontFamily: fonts.bodyBold },
  finishedContent: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', maxWidth: 650, minHeight: '90%', padding: 22, paddingBottom: 110, width: '100%' },
  resultRing: { alignItems: 'center', backgroundColor: '#c7ff4a10', borderColor: colors.portal, borderRadius: 80, borderWidth: 3, height: 160, justifyContent: 'center', width: 160 },
  resultValue: { color: colors.portal, fontFamily: fonts.displayHeavy, fontSize: 38 },
  resultKicker: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, marginTop: 24 },
  resultTitle: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 27, marginTop: 8, textAlign: 'center' },
  resultText: { color: colors.muted, fontFamily: fonts.body, lineHeight: 22, marginTop: 10, textAlign: 'center' },
  resultStats: { alignSelf: 'stretch', flexDirection: 'row', gap: 9, marginTop: 23 },
  resultStat: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 15, flex: 1, padding: 13 },
  resultStatValue: { color: colors.text, fontFamily: fonts.display, fontSize: 20 },
  resultStatLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 9, marginTop: 4 },
  againButton: { alignItems: 'center', alignSelf: 'stretch', backgroundColor: colors.portal, borderRadius: 14, flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 20, padding: 15 },
  againText: { color: colors.ink, fontFamily: fonts.bodyBold },
});
