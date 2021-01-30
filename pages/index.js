import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import db from '../db.json'
import Widget from '../src/components/Widget'
import QuizBackground from '../src/components/QuizBackground'
import QuizContainer from '../src/components/QuizContainer'
import Footer from '../src/components/Footer'
import GitHubCorner from '../src/components/GitHubCorner'
import Input from '../src/components/Input'
import Button from '../src/components/Button'
import QuizLogo from '../src/components/QuizLogo'
import Link from '../src/components/Link'


export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget
          as={motion.section}
          transition={{delay:0, duration:0.5}}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>Jurassic World</h1>
          </Widget.Header>
          <Widget.Content>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                router.push({
                  pathname: '/quiz',
                  query: { name: name }
                })
              }}>
              <Input
                onChange={(event) => setName(event.target.value)}
                placeholder="Diz ai seu nome"
                name="nomeDoUsuario"
                value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                {`Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>
        <Widget
          as={motion.section}
          transition={{delay:0.5, duration:0.5}}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Quizes da Galera</h1>
            <ul>
              {db.external.map((linkExterno) => {
                const [projectName, gitHubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.')

                return (
                  <li key={linkExterno}>
                    <Widget.Topic
                      as={Link}
                      href={`/quiz/${projectName}___${gitHubUser}`}>
                      {`${gitHubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                )
              })}

            </ul>
          </Widget.Content>
        </Widget>
        <Footer 
          as={motion.section}
          transition={{delay:1, duration:0.5}}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        />
        <GitHubCorner projectUrl="https://github.com/loressl" />
      </QuizContainer>
    </QuizBackground>
  )
}
