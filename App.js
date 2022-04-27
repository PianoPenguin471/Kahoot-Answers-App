import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import React, {useState} from 'react';

class QuestionAnswer {
  constructor (questionType, correctAnswers) {
    this.questionType = questionType;
    this.correctAnswers = correctAnswers;
  }
}

export default function App() {
  const [gameId, setId] = useState();
  const [answers, setAnswers] = useState();
  const [questionNum, setQuestionNum] = useState(0);
  const getAnswers = () => {
    var colors = ["red", "blue", "yellow", "green"]
    fetch('https://play.kahoot.it/rest/kahoots/' + gameId).then(res=>res.json().then((json => {
      var outputArr = []
      var questions = json.questions;
      for (var index = 0; index < questions.length; index++) {
        var question = questions[index]
        if (question.type === "quiz") {
          var correctColors = []          
          for (var i = 0; i < colors.length; i++) {
            if (question.choices[i].correct) {
              correctColors.push(colors[i])
            }
          }
          var output = new QuestionAnswer(question.type, correctColors);
          outputArr.push(output)
          console.log(output)
        } else if (question.type === "open_ended") { // Add support for text entry questions
          var correctAnswers = []
          for (let i = 0; i < question.choices.length; i++) {
            const choice = question.choices[i];
            if (choice.correct) correctAnswers.push(choice.answer)
          }
          outputArr.push(new QuestionAnswer(question.type, correctAnswers))
        } else if (question.type === "content") {
          outputArr.push(new QuestionAnswer(question.type, "No need to answer"))
        }
      }
      setAnswers(outputArr)
    }))).catch(e=>alert(e))
  }
  const getAnswersForDisplay = () => {
    if (answers != null && questionNum != null) {
      var questionType = answers[questionNum].questionType
      var questionAnswers = answers[questionNum].correctAnswers
      var questionNumber = questionNum + 1
      if (questionType === "content") return `No need to click anything for question #${questionNumber}`
      if (questionAnswers.length >= 2) {
        return `The answers to question #${questionNumber} are ${questionAnswers}`
      }
      return `The answer to question #${questionNumber} is ${questionAnswers}`
    }
    return "Enter the game id and press the button to get the answers"
  }
  return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={id => setId(id)}
          value={gameId}
          placeholder='Game id goes here'
        />
        <Button
          title='Get answers'
          color='#87ceeb'
          onPress={() => getAnswers()}
        />
        <Text>
          {getAnswersForDisplay()}
        </Text>
        <Button
          title="Next Question"
          style={styles.nextButton}
          onPress={() => setQuestionNum(questionNum + 1)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  nextButton: {
    marginLeft: 50
  }
});
