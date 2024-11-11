import React, { useState } from "react";
import { json, useParams } from "react-router-dom";
import './MockDraft.css';
import Confetti from 'react-confetti';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './LeagueDraft.css';
import MockDraft from "./MockDraft";

const LeagueDraft = () => {
    const { name } = useParams();

    return (
        <div>
            <div className="leagueDraftTitleContainer">
                <h1 className="leagueDraftTitle">
                    {name} Draft Page
                </h1>
            </div>
            <div className="draftContainer">
                <div className="draftFunction"><MockDraft /></div>
                <div className="draftOrder">
                    <h2>Draft Order</h2>
                    <p>No draft scheduled right now, <br/>but feel free to play around with the mock draft</p>
                </div>
            </div>
        </div>
    )
}
export default LeagueDraft;