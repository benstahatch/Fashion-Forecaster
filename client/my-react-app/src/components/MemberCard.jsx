// import useState from React library and CSS styling for team members' cards
import React, { useState } from 'react';
import "./MemberCard.css";

// an exportable function of member's card
export default function MemberCard ({ member, flipped, onToggle }) {
    /* state to track if card is flipped from hovering or not 
       (true = flip to back of card, false = front of card) */
    const [hovered, setHovered] = useState(false);

    /* toggle the card flip/hover state (if card is hovered and 
       flipped to the back and/or is clicked to keep it at the back) */
    const cardFlipped = hovered || flipped;

    // HTML 
    return (
        <> 
            {/* check if card is hovered and flipped or not with onClick and/or clicked 
                on to keep showing the back of the card  */}
            <div className = {`member-card ${cardFlipped ? "card flipped" : ""}`}
            onClick = {onToggle}
            onMouseEnter = {() => setHovered(true)}
            onMouseLeave = {() => setHovered(false)}
            >

                {/* team member's card contents */}
                <div className = 'member-card-contents'>
                    {/* front of card -> image of member, member's name, member's major */}
                    <div className = 'member-card-front'>
                        {/* image of member */}
                        <img src = {member.image} alt = {member.name} className = {member.name.toLowerCase()} />

                        {/* member's name and major */}
                        <div className = 'member-card-front-info'>
                            <h3>{member.name}</h3>
                            <p>{member.major}</p>
                        </div>
                    </div>

                    {/* back of card -> member's name, LinkedIn, and email */}
                    <div className = 'member-card-back'>
                        {/* member's name  */}
                        <h4>{member.name}</h4>

                        {/* member's LinkedIn */}
                        <a href = {member.linkedIn} target = '_blank' rel = 'noopener noreferrer'>LinkedIn</a>

                        {/* member's email -> use HTML email link protocol */}
                        <a href = {`mailto:${member.email}`}>Email</a>
                    </div>
                </div>
            </div>
        </>
    );
}