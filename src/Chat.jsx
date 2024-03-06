import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", info);
      setMessagesList((list) => [...list, info]);

      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const messaHandle = (data) => {
      setMessagesList((list) => [...list, data]);
    };
    socket.on("receive_message", messaHandle);
    return () => socket.off("receive_message", messaHandle);
  }, [socket]);

  return (
    <Box display={"flex"}>
      <Card sx={{ width: "100%" }}>
        <CardHeader title={`Chat en Vivo  |   Sala: ${room}`} />

        <Divider />
        <CardContent variant="tabs">
          {messagesList.map((item, i) => {
            return (
              <Box
                variant="div"
                key={i}
                display={"flex"}
                justifyContent={username === item.author ? "right" : "left"}
              >
                <Paper
                  elevation={4}
                  sx={{
                    margin: 2,
                    padding: 2,
                    maxWidth: "50%",
                    width: "fit-content",
                    bgcolor: "#DCF8C6",
                  }}
                >
                  <Box sx={{}}>
                    <Typography variant="h6" fontWeight={"bold"}>
                      {item.author}
                    </Typography>

                    <Typography variant="p">{item.message}</Typography>

                    <Typography>{item.time}</Typography>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </CardContent>
        <Paper
          sx={{
            mt: "20px",
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            type="text-area"
            label="Mensaje..."
            size="small"
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            sx={{
              maxWidth: "100%",
            }}
            value={currentMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ m: "8px" }}
            endIcon={<SendIcon />}
            onClick={sendMessage}
          >
            Enviar
          </Button>
        </Paper>
      </Card>
    </Box>
  );
};
