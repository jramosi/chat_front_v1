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
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [myUser, setmyUser] = useState(false);
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
    <Card sx={{ width: "100%" }}>
      <CardHeader title={`Chat en Vivo  |   Sala: ${room}`} />

      <Divider />
      <ScrollToBottom>
        <CardContent variant="tabs" sx={{ height: 350 }}>
          {messagesList.map((item, i) => {
            const bgcolor = username === item.author ? "#DCF8C6" : " #a2d9ce  ";
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
                    padding: 1,
                    maxWidth: "80%",
                    width: "fit-content",
                    bgcolor,
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={"bold"}>
                      {item.author}
                    </Typography>

                    <Typography variant="p">{item.message}</Typography>
                    <Box display={"flex"} justifyContent={"right"}>
                      <Typography variant="p" fontSize={12}>
                        {item.time}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </CardContent>
      </ScrollToBottom>
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
  );
};
