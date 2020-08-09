import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useRoom from '../hooks/UseRoom';
import Question from '../components/Question';

const LobbyContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  max-width: 810px;
  grid-template-columns: 200px 600px;
  grid-template-rows: 1fr;
  border: 2px solid black;
  padding: 5px;
`;
const ChatContainer = styled.div`
  grid-column: 2/2;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  grid-template-rows: 150px 1fr 50px;
  max-width: 600px;
  height: 400px;
  border: 2px solid green;
  padding: 5px;
`;

const QuestionContainer = styled.div`
  grid-row: 1/1;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
`;

const ChatBoxContainer = styled.div`
  grid-row: 2/2;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  overflow: auto;
  border: 2px dotted blue;
`;

const ChatInputContainer = styled.div`
  grid-row: 3/3;
  display: grid;
  grid-template-columns: 1fr 50px;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  border: 2px dashed cyan;
`;

const UserListContainer = styled.div`
  grid-column: 1/1;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
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
  height: calc(100% - 5px);
`;

const SendButton = styled.button`
  grid-column: 2/2;
  width: 100%;
  height: 100%;
`;

const JoinMessage = styled.li`
  color: green;
  font-weight: bolder;
  font-size: 12px;
`;

const LeaveMessage = styled.li`
  color: rosybrown;
  font-weight: bolder;
  font-size: 12px;
`;

const ChatMessage = styled.li`
  font-size: 12px;
`;

const LobbyView = ({ socket }) => {
  const chatBoxBottomRef = useRef(null);
  const { users, messages, currentQuestion, correctAnswer } = useRoom(socket, 'lobby');
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
    console.log(event.target.id);
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
                  return <JoinMessage key={idx}>{`[${m.timestamp}] : ${m.name} joined to room`}</JoinMessage>;
                case 'LEAVE':
                  return <LeaveMessage key={idx}>{`[${m.timestamp}] : ${m.name} left the room`}</LeaveMessage>;
                case 'DISCONNECT':
                  return <LeaveMessage key={idx}>{`[${m.timestamp}] : ${m.name} disconnected`}</LeaveMessage>;
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

export default LobbyView;
