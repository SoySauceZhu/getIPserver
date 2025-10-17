import express from "express";
import os from "os";
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

// Simple application logger helper
function appLog(...args) {
  const ts = new Date().toISOString();
  console.log('[app]', ts, ...args);
}

// HTTP request logging
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Plex Launcher</title>
    <style>
      body {
        font-family: system-ui, -apple-system, Arial, sans-serif;
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        color: #fff;
        height: 100vh;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.2rem;
        color: #ddd;
        max-width: 480px;
      }

      button {
        margin-top: 1.5rem;
        padding: 0.8rem 1.6rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: white;
        background: #ff9800;
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      button:hover {
        background: #ffc107;
        transform: translateY(-2px);
      }

      footer {
        position: absolute;
        bottom: 1rem;
        font-size: 0.9rem;
        color: #aaa;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Your Plex Gateway</h1>
    <p>Click below to open your Plex server on your local network.</p>
    <button onclick="window.location='/plex'">Open Plex Server</button>
    <footer>Powered by Node.js + Express + Cloudflare Tunnel</footer>
  </body>
</html>`);
});


app.get("/fashion", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WELCOME TO PLEX WORLD!!!</title>
    <style>
      body {
        background: linear-gradient(45deg, red, orange, yellow, green, cyan, blue, violet);
        color: lime;
        font-family: "Comic Sans MS", "Papyrus", cursive;
        text-align: center;
        padding: 50px;
        animation: bgmove 5s infinite linear;
      }

      @keyframes bgmove {
        from { background-position: 0 0; }
        to { background-position: 1000px 1000px; }
      }

      h1 {
        font-size: 4rem;
        text-shadow: 3px 3px 5px #000;
        border: 5px double magenta;
        padding: 10px;
        background: repeating-linear-gradient(45deg, pink, pink 10px, purple 10px, purple 20px);
      }

      p {
        font-size: 1.5rem;
        background-color: yellow;
        border: 4px dashed red;
        padding: 10px;
        color: blue;
      }

      marquee {
        font-size: 1.2rem;
        background: black;
        color: #0f0;
        margin: 20px;
        border: 3px groove cyan;
      }

      button {
        font-size: 2rem;
        font-weight: bold;
        background: radial-gradient(circle, #ff0000, #ff9900, #ffff00);
        border: 5px outset #fff;
        border-radius: 10px;
        color: #000;
        padding: 15px 30px;
        cursor: pointer;
        text-transform: uppercase;
        box-shadow: 5px 5px 10px #000;
        animation: pulse 1s infinite alternate;
      }

      button:hover {
        background: radial-gradient(circle, #00ff00, #00ffff, #0000ff);
        transform: rotate(3deg) scale(1.1);
      }

      @keyframes pulse {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
      }

      footer {
        margin-top: 50px;
        font-size: 1rem;
        color: black;
        background: repeating-linear-gradient(90deg, lime, lime 10px, orange 10px, orange 20px);
        padding: 10px;
        border: 3px dotted #000;
      }
    </style>
  </head>
  <body>
    <marquee behavior="alternate" scrollamount="10">🎉🎉 WELCOME TO THE FUTURE OF PLEX 🎉🎉</marquee>
    <h1>💾 PLEX ACCESS PORTAL 💾</h1>
    <p>Click the MAGICAL BUTTON below to enter your <b>SUPER AWESOME LOCAL PLEX SERVER!</b></p>
    <button onclick="window.location='/plex'">ENTER NOW 🚀</button>
    <marquee direction="right" behavior="scroll" scrollamount="7">⚡ Fast! ⚡ Secure! ⚡ Totally 1999! ⚡</marquee>
    <footer>© 1999-2025 Soysacue Zhu™ | Best viewed in Internet Explorer 6 | <blink>Under Construction 🚧</blink></footer>
  </body>
</html>`);
});


function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // in Node.js >= 18, net.family can be 'IPv4' or 4 depending on platform
      const family = typeof net.family === 'string' ? net.family : String(net.family);
      if (family.includes('4') && !net.internal) {
        return net.address;
      }
    }
  }
  // fallback to loopback
  return '127.0.0.1';
}

app.get('/plex', (req, res) => {
  const ip = getLocalIPv4();
  const url = `http://${ip}:32400/`;
  // temporary redirect to the Plex web port on the local IP
  appLog('redirecting to plex at', url, 'from', req.ip);
  res.redirect(url);
});

app.listen(PORT, () => {
  appLog(`Listening on port ${PORT}`);
  const ip = getLocalIPv4();
  appLog(`Plex redirect target when /plex is used: http://${ip}:32400/`);
});
