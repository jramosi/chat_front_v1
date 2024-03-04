import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Chat } from "./Chat";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Divider,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
} from "@mui/material";
const URL = process.env.URL_BACKEND;
const socket = io.connect(URL);
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username != "" && room != "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <Container>
      {!showChat ? (
        <Card sx={{ width: "100%" }}>
          <CardHeader title="Unirme al Chat" align="left" />
          <Divider />
          <CardContent>
            <Box>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  name="username"
                  label="Nombre de Usuario"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  fullWidth
                  name="room"
                  type="text"
                  label="Sala"
                  onChange={(e) => setRoom(e.target.value)}
                />
                <Button
                  onClick={joinRoom}
                  variant="contained"
                  color="primary"
                  sx={{ width: "300px" }}
                >
                  Unirse a la conversacion
                </Button>
              </Stack>
            </Box>
          </CardContent>

          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary" variant="body2">
              Pinstriped cornflower blue cotton blosaaaaaause takes you on a
              walk to the park or just down the hall.
            </Typography>
          </Box>
        </Card>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </Container>
  );
}

export default App;
