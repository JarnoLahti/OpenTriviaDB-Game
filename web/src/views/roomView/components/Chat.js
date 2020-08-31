import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const ChatComponent = ({ messages, onSend, userId }) => {
  const chatBoxBottomRef = useRef(null);
    const [message, setMessage] = useState('')
  useEffect(() => {
    chatBoxBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      onSend(message);
    }
  };

  const updateMessage = (event) => {
    setMessage(event.target.value);
  }

  const renderChatMessage = (chatMessage, idx) => {
      return (
        <ChatMessageItem key={idx}>
            <MessageContainer ownMessage={chatMessage.senderId === userId}>
                <SenderCell>{chatMessage.name}</SenderCell>
                <MessageCell>{chatMessage.content}</MessageCell>
                <TimestampCell>{chatMessage.timestamp}</TimestampCell>
            </MessageContainer>
      </ChatMessageItem>
      )
  }

  const renderInfoMessage = (infoMessage, idx) => {
      let container = null;
      switch(infoMessage.type){
        case 'JOIN':
            container = (<InfoMessageContainer join>{infoMessage.name} joined {infoMessage.timestamp}</InfoMessageContainer>)

            break;
        case 'LEAVE':
            container = (<InfoMessageContainer leave>{infoMessage.name} left {infoMessage.timestamp}</InfoMessageContainer>)

            break;
        case 'DISCONNECT':
            container = (<InfoMessageContainer disconnect>{infoMessage.name} disconnected {infoMessage.timestamp}</InfoMessageContainer>)

            break;
      }

      return (
          <InfoMessageItem key={idx}>
              { container }
          </InfoMessageItem>
      )
  }

  return (
    <Layout>
      <ChatBoxContainer>
        <Chat>
          {messages.map((m, idx) => {
            
            if(m.type !== 'MESSAGE'){
                return renderInfoMessage(m, idx);
            } else {
                return renderChatMessage(m, idx);
            }
          })}
          <div ref={chatBoxBottomRef}></div>
        </Chat>
      </ChatBoxContainer>
      <ChatInputContainer >
        <input type="text" value={message} onChange={updateMessage} onKeyDown={handleEnter} maxLength={300} />
      </ChatInputContainer>
    </Layout>
  );
};

const Layout = styled.div`
  display: grid;
  grid-template-rows: 1fr 100px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: ${(props) => props.theme.FOREGROUND_LIGHT};
  margin: 10px;
`;

const ChatBoxContainer = styled.div`
  display: block;
  position: relative;
  overflow: auto;
  grid-row: 1/1;
  margin: 10px 10px 5px 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: ${(props) => props.theme.BACKGROUND_LIGHT};
`;

const ChatInputContainer = styled.div`
  grid-row: 2/2;
  margin: 5px 10px 10px 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: ${(props) => props.theme.BACKGROUND_LIGHT};
`;

const Chat = styled.ul`
  position: absolute;
  display: block;
  top: 0;
  right: 0;
  bottom: 0; // HERE IS THE TRICK!
  left: 0;
  overflow: auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ChatMessageItem = styled.li`
  width: calc(100% - 20px) !important;
  height: 100px;
  margin: 10px 10px;
`;

const InfoMessageItem = styled.li`
    width: calc(100% - 20px) !important;
    height: 40px;
    margin: 10px 10px;
    align-content: center;
`;

const InfoMessageContainer = styled.div`
    width: 40%;
    padding: 10px;
    border-radius: 15px;
    background-color: ${props => {
        if(props.join){
            return props.theme.GREEN
        } else if(props.leave){
            return props.theme.ORANGE
        } else if(props.disconnect){
            return props.theme.RED
        }
        return props.theme.FOREGROUND_LIGHT;
    }}
`;

const MessageContainer = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  padding: 10px;
  border-radius: ${(props) => (props.ownMessage ? '15px 15px 0px 15px' : '15px 15px 15px 0px')};;
  float: ${(props) => (props.ownMessage ? 'right' : 'left')};
  background-color: ${(props) => (props.ownMessage ? props.theme.GREEN : props.theme.FOREGROUND_LIGHT)};
  width: 40%;
`;

const SenderCell = styled.div`
    grid-row: 1/1;
    justify-self: start;
    font-weight: bold;
`;

const MessageCell = styled.div`
    grid-row: 2/2;
    word-wrap: break-word;
    justify-self: start;
`;

const TimestampCell = styled.div`
    grid-row: 3/3;
    justify-self: end;
    font-weight: 300;
`;

export default ChatComponent;
