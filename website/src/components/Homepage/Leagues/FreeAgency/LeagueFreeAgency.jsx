import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FreeAgencyPage from '../../FreeAgencyPage';

const LeagueFreeAgency = () => {
    const leagueName = useParams();
    console.log(leagueName);
    return (
        <div>
            <div style={{ 'display': 'flex', 'justify-content': 'center' }}><h1>{leagueName.name} Free Agency</h1></div>
            <FreeAgencyPage league={leagueName.leagueName.toLowerCase() + '_free_agency'} />
        </div>
    );
};
export default LeagueFreeAgency;

