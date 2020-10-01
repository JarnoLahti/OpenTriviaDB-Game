import React from 'react';
import styled from 'styled-components';

const mockUsers = [
    {
        id: "1",
        name: "Jack Ebinner",
        points: 385,
        avatar: "https://image.flaticon.com/icons/svg/145/145842.svg"
    },
    {
        id: "2",
        name: "Joe Zohan",
        points: 1275,
        avatar: "https://image.flaticon.com/icons/svg/168/168734.svg"
    },
    {
        id: "3",
        name: "Lilly Roth",
        points: 655,
        avatar: "https://image.flaticon.com/icons/svg/145/145847.svg"
    },
    {
        id: "4",
        name: "Mark Bucker",
        points: 985,
        avatar: "https://image.flaticon.com/icons/svg/147/147144.svg"
    },
    {
        id: "5",
        name: "Fckn' Hippie",
        points: 1525,
        avatar: "https://image.flaticon.com/icons/svg/145/145843.svg"
    },
]

const UserList = styled.ul`
  list-style: none;
  width: 100%;
  height: 100%;
  margin: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
`;

const UserListItem = styled.li`
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  width: calc(100% - 20px);
  height: 75px;
  background-color: ${props => props.theme.BACKGROUND_LIGHT};
`;

const UserContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 2.5fr 1.5fr;
`;

const UserAvatarCell = styled.div`
  grid-column: 1/1;
  justify-self: center;
  align-self: center;
`;

const UserNameCell = styled.div`
  grid-column: 2/2;
  justify-self: start;
  align-self: center;
  padding-left: 0.5em;
  font-size: 1.6em;
  color: ${(props) => props.theme.FOREGROUND};
`;

const UserPointsCell = styled.div`
  grid-column: 3/3;
  justify-self: start;
  align-self: center;
  padding-left: 0.5em;
  font-size: 1.6em;
  color: ${(props) => props.theme.GREEN};
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
`;

const UserAvatarImg = styled.img`
  border-radius: 50%;
  border: 2px solid;
  border-color: ${(props) => props.theme.YELLOW};
`;

const UserListComponent = ({ users }) => {
  return (
    <UserList>
      {users.map((u) => {
        return (
          <UserListItem key={u.id}>
            <UserContainer>
              <UserAvatarCell>
                <UserAvatar>
                  <UserAvatarImg src={u.avatar} />
                </UserAvatar>
              </UserAvatarCell>
              <UserNameCell>{u.name}</UserNameCell>
              <UserPointsCell>{u.points}p</UserPointsCell>
            </UserContainer>
          </UserListItem>
        );
      })}
    </UserList>
  );
};

export default UserListComponent;
