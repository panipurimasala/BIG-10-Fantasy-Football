// import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from "../supabaseClient"; // Make sure to import your Supabase client
import { useEffect } from 'react';
// function getTournamentData() {
//     let allTournaments = require("../mock_data/privateTournaments.json");
//     let tournamentDict = {};
//     Object.keys(allTournaments).forEach(tournament => {
//         tournamentDict[tournament] = allTournaments[tournament];
//     });
//     return tournamentDict;
// }

// let tournamentDict = getTournamentData();

// function League() {
//     const [tourneyName, setTourneyName] = useState('');
//     const [password, setPassword] = useState('');
//     const [utilizer, setUser] = useState(null); // Initialize as null

//     // Fetch the current user when the component mounts
//     useEffect(() => {
//         const getUser = async () => {
//             const { data: { user } } = await supabase.auth.getUser();
//             if (user) {
//                 setUser(user);
//             }
//         };
//         getUser();
//     }, []);

//     const userInLeague = async (userId, targetLeagueId) => {
//         const { data, error } = await supabase
//             .from("user_leagues")
//             .select("league_id") // Ensure to select the correct column
//             .eq("user_id", userId); // Make sure to use the correct column name
//             alert("occured")
//         if (error) {
//             console.error("Error checking league membership:", error);
//             alert("This is first error")
//             return false;
//         }
//         // Check if the user is already in the league and returns league id
//         return data.some(record => record.league_id === targetLeagueId);
//     };

//     const leagueExists = async (leagueName, leagueId) => {
//         const { data, error } = await supabase
//             .from("leagues").select("league_name")
//             .eq("league_name", leagueName)

//         if (error) {
//             console.error("Error checking league existence:", error);
//             return false; // Return false in case of error
//         }

//         if (data!==undefined && data!==null) {
//             console.log("Here")
//             return data.id; // Return the existing league ID
//         } else {
//             // If the league does not exist, create it
//             console.log("here")
//             // const newLeagueId = uuidv4();
//             const { error: insertError } = await supabase
//                 .from("leagues")
//                 .insert({ id: leagueId, name: leagueName });
            
//             if (insertError) {
//                 console.error("Error creating league:", insertError);
//                 return false; // Return false if there was an error creating the league
//             }
//             return leagueId; // Return the new league ID
//         }
//     };

//     const handleJoinPrivateSubmit = async (e) => {
//         e.preventDefault();
//         let tournamentName = null;
//         let league_Id = null
//         // Check if the tournament exists with the provided ID and password
//         const match = Object.keys(tournamentDict).find(tournament => {
//             if (
//                 tournamentDict[tournament].id === tourneyName &&
//                 tournamentDict[tournament].password === password
//             ) {
//                 tournamentName = tournamentDict[tournament].name;
//                 league_Id = tournamentDict[tournament].id;
//                 console.log(tournamentName);
//                 console.log(league_Id);
//                 return true;
//             }
//             return false;
//         });

//         if (match) {
//             if (utilizer) { // Check if the user is logged in
//                 const leagueId = await leagueExists(tournamentName, ); // Check if the league exists or create it
//                 console.log(leagueId);
//                 if (leagueId) {
//                     console.log("inside")
//                     if (await userInLeague(utilizer.id, league_Id)) {
//                         alert("You have already joined this league");
//                     } else {
//                         // Add the user to the league
//                         const { error } = await supabase
//                             .from("user_leagues")
//                             .insert({ user_id: utilizer.id, league_id: leagueId });
//                         alert("Error")
                        
//                         if (error) {
//                             console.error("Error joining league:", error);
//                             alert("Error joining league. Please try again.");
//                         } else {
//                             alert("Successfully joined the league!");
//                         }
//                     }
//                 }
//             } else {
//                 alert("User is not authenticated. Please log in first.");
//             }
//         } else {
//             alert('Invalid ID or password');
//         }
        
//         // Reset input fields
//         setTourneyName('');
//         setPassword('');
//     };

//     return (
//         <div>
//             <h1>Join a Private Tournament</h1>
//             <form onSubmit={handleJoinPrivateSubmit}>
//                 <label>
//                     Tournament ID:
//                     <input
//                         type="text"
//                         value={tourneyName}
//                         onChange={(e) => setTourneyName(e.target.value)}
//                         required
//                     />
//                 </label>
//                 <br />
//                 <label>
//                     Password:
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </label>
//                 <br />
//                 <button type="submit">Join Private Tournament</button>
//             </form>
//         </div>
//     );
// }

// export default League;














import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LeaguePage.css';

function getTournamentData() {
    let allTournaments = require("../mock_data/privateTournaments.json");
    let tournamentDict = {};
    Object.keys(allTournaments).forEach(tournament => {
            tournamentDict[tournament] = allTournaments[tournament];
    })
    return tournamentDict;
}

let tournamentDict = getTournamentData();
let istestLeague = false;
let testLeagueName = "";

let allLeagueNames = []

function League() {
    const [tourneyName, setTourneyName] = useState ('');
    const [password, setPassword] = useState('');
    const [createtourneyName, setCreateTourneyName] = useState ('');
    const [createPassword, setCreatePassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [session, setSession] = useState(null);
    const [utilizer, setUser] = useState('');
    const [leaguess, setLeagues] = useState([]);
    useEffect(() => {
        const checkUser = async () => {
            const isLoggedIn = await getUser();
            setSession(isLoggedIn);
        };
        checkUser();
        leagues();
    }, []);
    const checkUser = async () => {
        const isLoggedIn = await getUser();
        setSession(isLoggedIn);
    };
    const getUser = async () => {
        const {data: {user} } = await supabase.auth.getUser();
        setSession(user);
        setUser(user);

        if(user === null || user===undefined){
            return false
        }
        return true
    };
    /* const handlePublicSubmit = (e) => { // for now only can join by used ID and password
        e.preventDefault();
        if (tourneyName) {
            const match =  Object.keys(publicTournamentsData).some(tourney => tourney.toLowerCase() === tourneyName.toLowerCase());
            if (match) {
                alert (' Joined tournament with ID: ${tourneyName)');
            }
            setTourneyName('');

        }
    }; */
    const handlejoinPrivateSubmit = async(e) => {
        e.preventDefault();
        if (tourneyName && password) { // tourneyName means the ID in this function
            const {data: {user} } = await supabase.auth.getUser();
            const s = String(user.id);
            const {data, error } = await supabase
            .from("leagues").select("leagueid").eq("league_name", tourneyName).eq("password", password);
            if(error){
                alert("This league doesn't exist. Create it.");
            }
            else{
                console.log("exists" + data[0].leagueid);
                const dat = data[0].leagueid
                if(dat){
                    const { err } = await supabase
                    .from("user_leagues").insert({user_id: s, league_id: dat})}
                else{
                    alert("league doesn't exist");
                }
            }
            setTourneyName('');
            setPassword('');
        }
    };
    const leagues = async () => {
        if (utilizer) {
            try {
                const { data: users_data, error: userError } = await supabase
                    .from("user_leagues")
                    .select("league_id")
                    .eq("user_id", utilizer.id);
                    console.log("users_data" + users_data);
    
                if (userError) {
                    console.error("Error fetching user leagues:", userError);
                    return;
                }
    
                if (users_data && users_data.length > 0) {
                    const userLeagueIds = users_data.map(item => item.league_id);
    
                    const { data: leagues_names, error: leagueError } = await supabase
                        .from("leagues")
                        .select("league_name")
                        .in("leagueid", userLeagueIds);
                    console.log("lnames" + users_data);
                    if (leagueError) {
                        console.error("Error fetching league names:", leagueError);
                        setLeagues([]);  // Set to an empty array on error
                    } else {
                        setLeagues(leagues_names || []);  // Default to an empty array if `leagues_names` is null/undefined
                    }
                } else {
                    setLeagues([]);  // No leagues found
                }
            } catch (err) {
                console.error("Unexpected error fetching leagues:", err);
                setLeagues([]);  // Set to an empty array on unexpected errors
            }
        }
    };


    const handleCreatePrivateSubmit = async(e) => {
        e.preventDefault();
        if (createPassword === confirmPassword) { 
            istestLeague = true;
            testLeagueName = createtourneyName;
            
        }
        else {
            alert ("passwords don't match");
        }
        const newLeagueId = uuidv4();
        const { error } = await supabase
        .from("leagues").insert({ leagueid: newLeagueId, league_name: createtourneyName, password: confirmPassword});
        if(error){
            alert("This league is already created or not fitting the criteria. Please try again");
        }
        setCreateTourneyName('');
        setCreatePassword('');
        setConfirmPassword('');
    };
    /* const handlePrivateSubmit = (e) => {
        e.preventDefault();
        if (tourneyName && password) {
            alert ('Created tournament with ID: ${tourneyName}');
            // export the tourney ID and shi
        } else {
            alert (" Invalid input");
        }
    }; */
    const Divider = () => {
        return (
          <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text">- or -</span>
            <div className="divider-line" />
          </div>
        );
    };

    const leagueBlock = () => {
        if(utilizer){
            checkUser();
        }
        if(leaguess){
            leagues();
        }
        return (
            <div className="currentLeaguesDisplay noLeague">
                <h2>Leagues:</h2>
                {leaguess.length > 0 ? (
                    <table>
                        <tbody>
                            {leaguess.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.league_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No leagues joined yet.</p>
                )}
                <h1 className="noLeagueHeader2">Join or Create a League to Get Started!</h1>
            </div>
        );
    };
    


    if (session) {
        return (
        <div className='pageContainer'>
            <div className='leagueContainer'>
                <div className="headerLogin">
                    <h1 className="leagueHeaders">Join a League</h1>
                    <form onSubmit={handlejoinPrivateSubmit}>
                        <label>
                            <p className='passwordText'>League ID:</p>
                            <input
                                type="text"
                                value={tourneyName}
                                onChange={(e) => setTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='joinLeagueButton' type="submit">Join League</button>
                    </form>
                </div>
                <Divider />
                <div className='createLeague'>
                    <h1 className="leagueHeaders">Create a League</h1>
                    <form onSubmit={handleCreatePrivateSubmit}>
                        <label>
                            <p className='passwordText'>League ID:</p>
                            <input
                                type="text"
                                value={createtourneyName}
                                onChange={(e) => setCreateTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input
                                type="text"
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                required
                            />
                            <p className='passwordText'>Confirm Password:</p>
                            <input
                                type="text"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='createLeagueButton' type="submit">Join League</button>
                    </form>
                </div>
            </div>
            <div className='currentLeaguesContainer'>
                    <div className='currentHeader'><h1 className='currentLeaguesText'>Current Leagues</h1></div>
                    {leagueBlock()}    
            </div>
        </div>);
    }
    else {
        return (<h1 className="headerNoLogin">Login To Get Started</h1>);
    }


}
export default League;