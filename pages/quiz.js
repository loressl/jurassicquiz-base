import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import QuizLogo from '../src/components/QuizLogo'
import AlternativesForm from '../src/components/AlternativeForm'

import HashLoader from 'react-spinners/HashLoader'
import { useRouter } from 'next/router'

function ResultWidget({ results, name }) {
    return (
        <Widget>
            <Widget.Header>
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                <h2>{name}, </h2>
                <p>
                    Você acertou
                    {' '}
                    {results.filter((x) => x).length}
                    {' '}
                    perguntas
                </p>
                <ul>
                    {results.map((result, index) => (
                        <li key={`result__${result}`}>
                            #
                            {index + 1}
                            {' '}
                        Resultado:
                            {result === true
                                ? 'Acertou'
                                : 'Errou'}
                        </li>
                    ))}
                </ul>
            </Widget.Content>
        </Widget>
    );
}

function LoadingWidget({ loading }) {
    return (
        <Widget>
            <Widget.Header>
                Carregando...
      </Widget.Header>

            <Widget.Content>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <HashLoader
                        color={db.theme.colors.primary}
                        loading={loading}
                        size={60}
                    />
                </div>
            </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({
    question,
    questionIndex,
    totalQuestions,
    onSubmit,
    addResult
}) {
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined)
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false)
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer
    const hasAlternativeSelected = selectedAlternative !== undefined

    return (
        <Widget>
            <Widget.Header>
                {/* <BackLinkArrow href="/" /> */}
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
                </h3>
            </Widget.Header>

            <img
                alt="Descrição"
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                }}
                src={question.image}
            />
            <Widget.Content>
                <h2>
                    {question.title}
                </h2>
                <p>
                    {question.description}
                </p>

                <AlternativesForm
                    onSubmit={(infosDoEvento) => {
                        infosDoEvento.preventDefault();
                        setIsQuestionSubmited(true)
                        setTimeout(() => {
                            addResult(isCorrect)
                            onSubmit();
                            setIsQuestionSubmited(false)
                            setSelectedAlternative(undefined)
                        }, 3 * 1000)
                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
                        const isSelected = selectedAlternative === alternativeIndex;
                        return (
                            <Widget.Topic
                                as="label"
                                key={alternativeId}
                                htmlFor={alternativeId}
                                data-selected={isSelected}
                                data-status={isQuestionSubmited && alternativeStatus}
                            >
                                <input
                                    style={{ display: 'none' }}
                                    id={alternativeId}
                                    name={questionId}
                                    type="radio"
                                    onChange={() => setSelectedAlternative(alternativeIndex)}
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    {/* <pre>
                        {JSON.stringify(question, null, 4)}
                    </pre> */}
                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>
                    {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
                    {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
                </AlternativesForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
};

export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const [results, setResults] = React.useState([])
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];
    const router = useRouter()
    const name = router.query.name

    function addResult(result) {
        // results.push(result);
        setResults([
            ...results,
            result,
        ]);
    }

    // [React chama de: Efeitos || Effects]
    // React.useEffect
    // atualizado === willUpdate
    // morre === willUnmount
    React.useEffect(() => {
        // fetch() ...
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
        // nasce === didMount
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget loading={screenState === screenStates.LOADING} />}

                {screenState === screenStates.RESULT && <ResultWidget results={results} name={name} />}
            </QuizContainer>
        </QuizBackground>
    );
}