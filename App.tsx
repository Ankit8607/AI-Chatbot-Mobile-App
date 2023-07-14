import React, { useState, useEffect, useRef} from "react";
import { View, TextInput, Button, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Image } from "react-native";

const WebViewComponent = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const scrollViewRef = useRef(null);

  const handleSend = () => {
    if (message.trim() !== "") {
      const userQuestion = message.trim();
      setChatLog((prevLog) => [
        ...prevLog,
        { sender: "user", message: userQuestion },
        { sender: "bot", message: "", loading: true }
      ]);
      setMessage("");

      fetch("https://d5i49ranb0.execute-api.ap-south-1.amazonaws.com/student-api-HelloWorldFunction-bWzTR6kX26Dz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userQuestion })
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("API request failed");
          }
          return response.json();
        })
        .then((responseData) => {
          setChatLog((prevLog) => {
            const updatedLog = prevLog.map((chat, index) => {
              if (chat.sender === "bot" && chat.loading) {
                return { ...chat, loading: false, message: responseData };
              }
              return chat;
            });
            return updatedLog;
          });
        })
        .catch((error) => {
          console.error(error);
        });
      // setChatLog((prevLog) => {
      //   const updatedLog = prevLog.map((chat, index) => {
      //     if (chat.sender === "bot" && chat.loading) {
      //       return { ...chat, loading: false, message: "hi ankit" };
      //     }
      //     return chat;
      //   });
      //   return updatedLog;
      // });
      // // Scroll to the bottom when a new message is sent
      // scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    // Scroll to the bottom initially and whenever chatLog changes
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [chatLog]);

  return (
    // <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Simpl AI Chatbot</Text>
      </View>
      <View style={styles.watermarkContainer}>
        <Image source={require("./assets/simpl.jpeg")} style={styles.watermarkImage} />
      </View>
      <View style={styles.chatContainer}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
      <View style={styles.chatLog}>
        {chatLog.map((chat, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              chat.sender === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer
            ]}
          >
            {chat.sender === "user" && (
              <Text style={styles.userMessageText}>{chat.message}</Text>
            )}
            {chat.sender === "bot" && (
              <Text style={styles.botMessageText}>
                {chat.loading ? "Loading..." : chat.message}
              </Text>
            )}
          </View>
        ))}
      </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your question"
          multiline={true}
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
      </View>
    {/* </KeyboardAvoidingView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // padding: 16,
    // paddingTop: 0,
  },
  watermarkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    // top: "40%",
    left: "10%",
    // transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 0,
  },
  watermarkImage: {
    width: 300,
    height: 300,
    opacity: 0.2,
  },
  header: {
    backgroundColor: "#02bab0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(0,0,0, 1)",
  },
  chatContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatLog: {
    flexGrow: 1,
    marginBottom: 16,
    justifyContent: 'flex-end',
    padding: 16,
  },
  messageContainer: {
    alignSelf: "flex-end",
    maxWidth: "80%",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  userMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(125,125,125,0.3)",
  },
  botMessageContainer: {
    backgroundColor: '#02bab0',
  },
  userMessageText: {
    color: "black"
  },
  botMessageText: {
    color: "black"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom:8,
  },
  input: {
    flex: 1,
    alignItems: "center",
    marginRight: 8,
    // marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
  }
});

export default WebViewComponent;
