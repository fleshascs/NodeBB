import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const MedalsContainer = styled.div`
  & img {
    padding: 10px;
  }
`;

export default function Medals({ medals }) {
  return (
    <MedalsContainer>
      {medals.map((medal) => (
        <Medal key={medal.gid} url={medal.award.url} name={medal.award.name} />
      ))}
    </MedalsContainer>
  );
}

function Medal({ name, url }) {
  return (
    <Tooltip title={name}>
      <img src={url} />
    </Tooltip>
  );
}
