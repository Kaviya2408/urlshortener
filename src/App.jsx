import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { longUrl, alias });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || 'Something went wrong!');
    }
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="url"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom alias (optional, e.g., my-link)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <div className="result">
          Short URL: <a href={shortUrl} target="_blank">{shortUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;
