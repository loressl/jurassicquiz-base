import React from 'react';
import db from '../../db.json';
import { useRouter } from 'next/router'

import QuizScreen from '../../src/screens/Quiz'

export default function QuizPage(){
    const router = useRouter()
    const name = router.query.name

    return(
        <>
            <QuizScreen externalQuestions={db.questions} externalBg={db} name={name}/>
        </>
    )
}