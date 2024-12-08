import React, { useState, useEffect } from "react";
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useLocation } from "react-router-dom";

interface LatLng {
  lat: number;
  lng: number;
}

interface Team {
  name: string, 
  codeInvite: string,
  qaCode: string,
  shareURL: string,
  poiId: string[],
  players: string[]
}

interface POI {
  id: string;
  name: string;
  lat: number;
  long: number;
  beschreibung: string;
  punkte: number;
}


const MapPage: React.FC = () => {
  const [game, setGame] = useState<any>(null); 
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [pois, setPois] = useState<POI[]>([]); 
  const [positionPlayer, setPositionPlayer] = useState<LatLng | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<Map<string, number>>(new Map()); // State to hold the scores for each team
  const mapCenter: LatLng = { lat: 52.544569, lng: 13.354061 };
  const location = useLocation();
  let { dataGameInstance, playerID, teamID } = location.state || {}; 

  const playerId = playerID;
  const teamIds = teamID;


  const claimPoint = async (poi: POI) => {{
    //TODO: Route für finden von Team anhand von PlayerID -> POI in Team POIs Array einfügen -> Punkte anzeigen -> Game beenden Button
  }
    try {
      const payload = {
        teamIds: teamIds,
        playerId: playerId
      }
      console.log(payload)
      const claimResponse = await fetch((`${process.env.REACT_APP_REST_API_URL}poi/claim/${poi.id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify(payload)
      })
      if(claimResponse.ok){
        const responseData = await claimResponse.json()
      } else {
        const errorData = await claimResponse.json();
        console.error("Error claiming POI:", errorData);
      }
    } catch (error) {
      console.error("Failed to claim POI:", error);
    }
  };

  const calculateScore = async (teamId: Team) => {
    try {
      const fetchString = `${process.env.REACT_APP_REST_API_URL}team/team/${teamId}`
      const teamResponse = await fetch(fetchString);
      if(!teamResponse.ok){
        throw new Error("failed to fetch Team")
      }
      const team = await teamResponse.json();
      
      const poiIdArray = team.poiId;

      // Initialize total score
      let totalScore = 0;
  
      // Loop through each POI ID, fetch the POI, and accumulate the score
      const pois = await Promise.all(
        poiIdArray.map(async (poiId: string) => {
          const response = await fetch(`${process.env.REACT_APP_REST_API_URL}poi/${poiId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch POI with ID: ${poiId}`);
          }
          const poi = await response.json();
          return poi.punkte;  // Assuming `punkte` is the property holding the score
        })
      );
  
      // Calculate total score by summing up the `punkte` of each POI
      totalScore = pois.reduce((acc: number, points: number) => acc + points, 0);
  
      // Print the total score
      //console.log(`Total score for team ${team.name}: ${totalScore}`);
      
      // Update the scores state
      setScores(prevScores => new Map(prevScores.set(teamId.toString(), totalScore)));
      //console.log("Score: " + totalScore)
      return totalScore;
    } catch (error) {
      console.error("Error calculating score:", error);
    }
  };


  const handleViewTeamsClick = async () => {
    setIsPopupOpen(true);
  
    const updatedScores = new Map();  // Local map to store scores temporarily
  
    let i = 1;
    // Fetch scores for each team and update the local map
    for (const team of teamIds) {
      try {
        const score = await calculateScore(team);
        console.log(`Score for Team ${i}:`, score);
      } catch (error) {
        console.error(`Error calculating score for team ${i}:`, error);
      }
      i++;
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const responseGame = await fetch((process.env.REACT_APP_REST_API_URL + `game/`));
        if (!responseGame.ok) {
          throw new Error("Failed to fetch game");
        }
        const gameData = await responseGame.json();
        const poiIdArray = gameData.poilId;

        if (!Array.isArray(poiIdArray)) {
          throw new Error("poiId is not an array or does not exist");
        }

        const pois = await Promise.all(
          poiIdArray.map(async (id) => {
            const response = await fetch(process.env.REACT_APP_REST_API_URL + `poi/${id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ID: ${id}`);
            }
            return response.json(); 
          })
        );
        setGame(gameData);
        setPois(pois);
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setPositionPlayer({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation not supported");
    }
  }, []);  // Only run once on component mount

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      {isPopupOpen && (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
    }}
  >
    <h2>Teams List</h2>
    <ul>
      {Array.from(scores).map(([teamName, score]) => (
        <li key={teamName}>
          <p>{teamName} - Score: {score}</p>
        </li>
      ))}
    </ul>
    <button
      style={{
        background: 'red',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px',
      }}
      onClick={() => setIsPopupOpen(false)}
    >
      Close
    </button>
  </div>
)}


      <div style={{ height: "90vh" }}>
        <GoogleMap defaultZoom={10} defaultCenter={mapCenter} mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID || ""}>
        <button
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          padding: '10px 20px',
          backgroundColor: '#FFC107',
          color: 'black',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          fontSize: '16px',
        }}
        onClick={handleViewTeamsClick}  // Trigger the score calculation
      >
        View Teams
      </button>
          {/* Display POIs from the `pois` array */}
          {pois.map((poi, index) => (
            <AdvancedMarker
              key={poi.id}
              position={{ lat: poi.lat, lng: poi.long }} 
              onClick={() => setOpenIndex(index)}
            >
              <Pin background='#FFC107' borderColor="black" glyphColor="black" />
              {openIndex === index && (
                <InfoWindow
                  position={{ lat: poi.lat, lng: poi.long }}
                  onCloseClick={() => setOpenIndex(null)}
                >
                  <div>
                    <h3>{poi.name}</h3>
                    <p>{poi.beschreibung}</p>
                    <p>Points: {poi.punkte}</p>
                    <button  style={{
                      background: '#FFC107',
                      color: "black",
                      padding: "10px 20px",
                      border: "none" ,
                      cursor: "pointer",
                      borderRadius: "5px",
                      fontSize: "16px"
                    }} onClick={() => claimPoint(poi)} >CLAIM</button>
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
          
          {/* Marker for Player Position */}
          {positionPlayer && (
            <AdvancedMarker position={positionPlayer}>
              <Pin background="white" />
            </AdvancedMarker>
          )}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};


export default MapPage;
