import React from 'react';
import Widget from '../Widget'

export default function ResultWidget({ results, name }) {
    return (
        <Widget>
            <Widget.Header>
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                {name !== "" && <h2>{name}, </h2>}
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