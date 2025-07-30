import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/Navbar';

const MoodTrack = () => {
  const { username } = useParams();
  // This is the line that has been corrected.
  // We are using [mood, setMood] again to fix the build error.
  const [mood, setMood] = useState('');
  const [moods, setMoods] = useState([]);
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/moods/${username}`);
        setMoods(response.data);
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, [username]);

  const handleMoodChange = (event) => {
    setMood(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`API_BASE_URL/api/moods/${username}`, { mood });
      // After submitting, refetch moods to update the list
      const response = await axios.get(`API_BASE_URL/api/moods/${username}`);
      setMoods(response.data);
      setMood(''); // Clear the input after submission
    } catch (error) {
      console.error('Error submitting mood:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Mood Tracker for {username}</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="mood" className="block text-lg font-medium mb-2">How are you feeling today?</label>
          <input
            type="text"
            id="mood"
            value={mood}
            onChange={handleMoodChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="e.g., Happy, Sad, Anxious"
          />
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
            Save Mood
          </button>
        </form>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Mood History</h2>
          <ul>
            {moods.map((entry) => (
              <li key={entry._id} className="mb-2 p-2 border rounded-md">
                {new Date(entry.date).toLocaleDateString()}: {entry.mood}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MoodTrack;
