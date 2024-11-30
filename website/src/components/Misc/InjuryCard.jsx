import React from 'react';
import './InjuryCard.css';
const InjuryCard = ({ playerImage, name, team, position, status, injury }) => {
  return (
    <div className="injury-card">
      <img src={playerImage} alt={`${name}`} className="player-img" />
      <div className="injury-details">
        <h4>{name} {team} - {position}</h4>
        <p>{injury}</p>
      </div>
      <div className={`injury-status ${status}`}>{status}</div>
    </div>
  );
};

export default InjuryCard;