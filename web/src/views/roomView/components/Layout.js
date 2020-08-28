import React from 'react';
import styled from 'styled-components';
import UserList from './UserList';

const BaseLayout = styled.div`
    display: grid;
    width: 100vw;
    height: 100vh;
    grid-template-columns: 500px 1fr;
`;

const UserListContainer = styled.div`
    grid-column: 1/1;
    width: 100%;
    height: 100%;
    background-color: ${ props => props.theme.BACKGROUND };
`;

const ContentContainer = styled.div`
    grid-column: 2/2;
    background-color: ${ props => props.theme.FOREGROUND };
    width: 100%;
    height: 100%;
`;

const Layout = ({users}) => {
    return(
        <BaseLayout>
            <UserListContainer >
                <UserList users={users}/>
            </UserListContainer>
            <ContentContainer /> 
        </BaseLayout>
    )
}

export default Layout;