import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Use axios for making API calls from the frontend
import Loader from 'react-js-loader';
import Navbar from '../navbar/Navbar';
import './Therapist.css';

// We do not import any backend packages like express or node-fetch here.

const TypingAnimation = ({ color }) => (
  <div className="item text-2xl">
    <Loader type="ping-cube" bgColor={color} color={color} size={100} />
  </div>
);

const Therapist = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    // Use a callback with setMessages to ensure you have the latest state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
    try {
      // This is the correct way to call your backend from your frontend.
      // It sends a request to the /api/aichat route you created.
      const response = await axios.post(`${API_BASE_URL}/api/aichat`, {
        message: input
      });
      
      const aiMessage = { sender: 'ai', text: response.data.message };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = { sender: 'ai', text: 'An error occurred while generating the response.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      // This line has been corrected from chatBox_ref to chatBoxRef
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="therapist-container">
        <h1 className="heading">Your Personal AI Assistant</h1>
        <div ref={chatBoxRef} className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              {msg.text}
            </div>
          ))}
          {loading && <TypingAnimation color="#007BFF" />}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="input-field"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    </>
  );
};

export default Therapist;
