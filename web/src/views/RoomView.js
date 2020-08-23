import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useRoom from '../hooks/UseRoom';
import Question from '../components/Question';
import { useParams } from '@reach/router';

const LobbyContainer = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr;
`;

const ChatContainer = styled.div`
  grid-column: 2/2;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 150px 1fr 50px;
  border: 2px solid green;
  padding: 5px;
`;

const QuestionContainer = styled.div`
  grid-row: 1/1;
  width: 100%;
  height: 100%;
`;

const ChatBoxContainer = styled.div`
  grid-row: 2/2;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 2px dotted blue;
`;

const ChatInputContainer = styled.div`
  grid-row: 3/3;
  display: grid;
  grid-template-columns: 1fr 50px;
  width: 100%;
  height: 100%;
  border: 2px dashed cyan;
`;

const UserListContainer = styled.div`
  grid-column: 1/1;
  width: 100%;
  height: 100%;
  border: 2px double salmon;
`;

const Chat = styled.ul`
  overflow: auto;
  list-style: none;
  margin: 0px;
  padding: 0px;
`;

const ChatInput = styled.input`
  grid-column: 1/1;
  width: 100%;
  height: 100%;
`;

const SendButton = styled.button`
  grid-column: 2/2;
  width: 100%;
  height: 100%;
`;

const InfoMessage = styled.li`
  color: ${(props) => props.color};
  font-weight: bolder;
  font-size: 12px;
`;

const ChatMessage = styled.li`
  font-size: 12px;
`;

const RoomView = ({ socket }) => {
  const chatBoxBottomRef = useRef(null);
  const params = useParams();
  const { users, messages, currentQuestion, correctAnswer } = useRoom(socket, params.id);
  const [chatMessage, setChatMessage] = useState('');

  const sendMessage = () => {
    if (!chatMessage || chatMessage.trim().length === 0) {
      return;
    }
    socket.emit('chat_message', chatMessage);
    setChatMessage('');
  };

  const updateMessage = (event) => {
    setChatMessage(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  };

  const handleAnswer = (event) => {
    socket.emit('submit_answer', { questionId: currentQuestion.id, answerId: event.target.id });
  };

  useEffect(() => {
    chatBoxBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <LobbyContainer>
      <UserListContainer>
        <Chat>
          {users.map((m, idx) => (
            <li key={idx}>{m.name}</li>
          ))}
        </Chat>
      </UserListContainer>
      <ChatContainer>
        <QuestionContainer>
          {currentQuestion ? (
            <QuestionContainer>
              {currentQuestion ? (
                <Question question={currentQuestion.content} selections={currentQuestion.selections} handleAnswer={handleAnswer} correctAnswer={correctAnswer} />
              ) : null}
            </QuestionContainer>
          ) : null}
        </QuestionContainer>

        <ChatBoxContainer>
          <Chat>
            {messages.map((m, idx) => {
              switch (m.type) {
                case 'JOIN':
                  return <InfoMessage color={'#66fc03'} key={idx}>{`[${m.timestamp}] : ${m.name} joined to room`}</InfoMessage>;
                case 'LEAVE':
                  return <InfoMessage color={'#fc4e03'} key={idx}>{`[${m.timestamp}] : ${m.name} left the room`}</InfoMessage>;
                case 'DISCONNECT':
                  return <InfoMessage color={'#fc4e03'} key={idx}>{`[${m.timestamp}] : ${m.name} disconnected`}</InfoMessage>;
                case 'ANSWER_SUBMIT':
                  return (
                    <InfoMessage color={m.isCorrectAnswer ? '#66fc03' : '#fc4e03'} key={idx}>{`[${m.timestamp}] : ${m.name} ${
                      m.isCorrectAnswer ? 'answered correctly' : 'answered incorrectly'
                    }`}</InfoMessage>
                  );
                default:
                  return <ChatMessage key={idx}>{`[${m.timestamp}] : ${m.name} > ${m.content}`}</ChatMessage>;
              }
            })}
          </Chat>
          <div ref={chatBoxBottomRef}></div>
        </ChatBoxContainer>
        <ChatInputContainer>
          <ChatInput type="text" value={chatMessage} onChange={updateMessage} onKeyDown={handleEnter} />
          <SendButton type="button" onClick={sendMessage}>
            send
          </SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </LobbyContainer>
  );
};

export default RoomView;
