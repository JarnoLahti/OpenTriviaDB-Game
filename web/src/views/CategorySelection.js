import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'styled-icons/fa-solid';
import ApiClient from '../lib/ApiClient';
import { useNavigate } from '@reach/router';

const ViewLayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #424242;
`;

const SelectionCenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 15em 1fr 15em;
  width: 100%;
  height: 100% !important;
`;

const SelectionContainer = styled.div`
  grid-column: 2/2;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(auto-fill, 300px);
  width: 100%;
  height: 100% !important;
  justify-content: center;
  align-content: center;
`;

const SelectionItemContainer = styled.div`
  width: 300px;
  height: 200px;
  border-radius: 5px;
  background-color: #efebe9;
`;

const CategorySelectionView = () => {
  const [staticRooms, setStaticRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await ApiClient.fetchStaticRooms();
      setStaticRooms(result.data);
    })();
  }, []);

  const getIcon = (title) => {
    const iconProps = { size: 20, color: '#FABFAB' };
    switch (title) {
      case 'MOVIES':
        return <FontAwesome.Film {...iconProps} />;
      case 'MUSIC':
        return <FontAwesome.Headphones {...iconProps} />;
      case 'GEOGRAPHY':
        return <FontAwesome.GlobeAmericas {...iconProps} />;
      case 'SCIENCE':
        return <FontAwesome.Dna {...iconProps} />;
      case 'SPORT':
        return <FontAwesome.BasketballBall {...iconProps} />;
      default:
        return <FontAwesome.Random {...iconProps} />;
    }
  };

  return (
    <ViewLayoutContainer>
      <SelectionCenterWrapper>
        <SelectionContainer>
          {staticRooms.map((s) => (
            <SelectionItemContainer key={s.id} onClick={() => navigate(`/room/${s.id}`)}>
              {s.title} {getIcon(s.title)}
            </SelectionItemContainer>
          ))}
        </SelectionContainer>
      </SelectionCenterWrapper>
    </ViewLayoutContainer>
  );
};

export default CategorySelectionView;
