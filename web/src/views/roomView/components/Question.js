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
      {question ? (<>
        <QuestionContainer dangerouslySetInnerHTML={{ __html: `${question.content} (${question.difficulty}: ${question.points}p)` }} />
        <AnswerContainer>
          {question.selections.map((selection, idx) => {
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
              })}
        </AnswerContainer>
        </>
      ):null}
    </ComponentContainer>
  );
};


const ComponentContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1.5fr;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: ${props => props.theme.FOREGROUND_LIGHT};
  margin: 10px;
`;


const QuestionContainer = styled.div`
  grid-row: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2.4em;
`;

const AnswerContainer = styled.div`
  grid-row: 2/2;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`;

const AnswerSlot = styled.div`
  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.col};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnswerButton = styled.button`
  background-color: ${(props) => (props.isCorrect != null ? (props.isCorrect ? props.theme.GREEN : props.theme.RED) : props.theme.BLUE)};
  border-radius: 4px;
  width: 100%;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.6em;
  font-weight: bold;
  padding: 2px 32px;

  :hover {
    background-color: ${props => props.theme.BLUE_DARK};
  }

  :active {
    position: relative;
    top: 1px;
  }
`;

export default QuestionComponent;
