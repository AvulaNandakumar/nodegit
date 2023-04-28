const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;

const initializingDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};
initializingDbAndServer();

//API 1

const convertingToCamelCase = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    roll: object.role,
  };
};

app.get("/players/", async (request, response) => {
  const dbQuery = ` select * from cricket_team;`;
  const dbResult = await db.all(dbQuery);

  const camelCaseArray = dbResult.map((eachObject) =>
    convertingToCamelCase(eachObject)
  );
  response.send(camelCaseArray);
});

//API2

app.post("/players", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerDetailsDbQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)  
  VALUES (${playerName},${jerseyNumber},${role});`;
  const responseId = await db.run(playerDetailsDbQuery);
  response.send(`Player Added to Team`);
});

module.exports = app;
