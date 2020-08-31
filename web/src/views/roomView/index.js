import React from 'react';
import { useParams } from '@reach/router';
import styled from 'styled-components';
import useRoom from '../../hooks/UseRoom';
import Question from './components/Question';
import UserList from './components/UserList';
import Chat from './components/Chat';


const FullSizeDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const BaseLayout = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 500px 1fr;
`;

const UserListContainer = styled(FullSizeDiv)`
  grid-column: 1/1;
  background-color: ${(props) => props.theme.BACKGROUND};
`;

const ContentContainer = styled(FullSizeDiv)`
  grid-column: 2/2;
  display: grid;
  grid-template-rows: 1fr 2fr;
  background-color: ${(props) => props.theme.FOREGROUND};
`;

const QuestionContainer = styled(FullSizeDiv)`
  grid-row: 1/1;
`;

const ChatContainer = styled(FullSizeDiv)`
  grid-row: 2/2;
`;

const RoomView = ({ socket }) => {
  const params = useParams();
  const { users, messages, currentQuestion, correctAnswer } = useRoom(socket, params.id);

  const sendMessage = (message) => {
    if (!message || message.trim().length === 0) {
      return;
    }

    socket.emit('chat_message', message);
  };
  

  const handleAnswer = (event) => {
    socket.emit('submit_answer', { questionId: currentQuestion.id, answerId: event.target.id });
  };


  return (
    <BaseLayout>
      <UserListContainer>
        <UserList users={users} />
      </UserListContainer>
      <ContentContainer>
        <QuestionContainer>
          <Question question={currentQuestion} handleAnswer={handleAnswer} correctAnswer={correctAnswer} />
        </QuestionContainer>
        <ChatContainer>
          <Chat messages={messages} onSend={sendMessage} userId={socket.id}/>
        </ChatContainer>
      </ContentContainer>
    </BaseLayout>
  );
};

export default RoomView;
