import React from 'react';
import styled from 'styled-components';

const QuestionComponent = ({ question, correctAnswer, handleAnswer }) => {
  const isCorrect = (answerId) => {
    if (!correctAnswer) {
      return null;
    }
    return correctAnswer.selectionId === answerId;
  };

  return (
    <ComponentContainer>
      <QuestionContainer dangerouslySetInnerHTML={{ __html: `${question.content} (${question.difficulty}: ${question.points}p)` }} />
      <AnswerContainer>
        {question.selections
          ? question.selections.map((selection, idx) => {
              let row = '1/1';
              let column = '1/1';

              if (idx > 1) {
                row = '2/2';
              }
              if (idx % 2 > 0) {
                column = '2/2';
              }

              return (
                <AnswerSlot key={`${selection.answer}`} row={row} col={column}>
                  <AnswerButton id={selection.id} dangerouslySetInnerHTML={{ __html: `${selection.answer}` }} onClick={handleAnswer} isCorrect={isCorrect(selection.id)} />
                </AnswerSlot>
              );
            })
          : null}
      </AnswerContainer>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1.5fr;
  width: 100%;
  height: 100% !important;
  border: 2px dashed palevioletred;
`;

const QuestionContainer = styled.div`
  grid-row: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  border: 2px dotted olivedrab;
  font-size: 16px;
`;

const AnswerContainer = styled.div`
  grid-row: 2/2;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  border: 2px dotted orangered;
`;

const AnswerSlot = styled.div`
  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.col};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnswerButton = styled.button`
  box-shadow: 0px 10px 14px -7px #276873;
  background: ${(props) =>
    props.isCorrect != null
      ? props.isCorrect
        ? 'linear-gradient(to bottom, #77b55a 5%, #72b352 100%);'
        : 'linear-gradient(to bottom, #f24537 5%, #c62d1f 100%)'
      : 'linear-gradient(to bottom, #599bb3 5%, #408c99 100%)'};
  background-color: ${(props) => (props.isCorrect != null ? (props.isCorrect ? '#77b55a' : '#f24537') : '#599bb3')};
  border-radius: 4px;
  width: 100%;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 32px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #3d768a;

  :hover {
    background: linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
    background-color: #408c99;
  }

  :active {
    position: relative;
    top: 1px;
  }
`;

export default QuestionComponent;
