import express from "express";
import os from "os";
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

// ====== 可配置部分 ======
const PUBLIC_PLEX_URL = process.env.PUBLIC_PLEX_URL || 'https://plex.soysauces.xyz/';
const PUBLIC_PLEX_PORT = process.env.PUBLIC_JELLYFIN_URL || 'https://jellyfin.soysauces.xyz/';
// Jellyfin public URL (prefer explicit env, otherwise fall back to existing value)
const PUBLIC_JELLYFIN_URL = process.env.PUBLIC_JELLYFIN_URL || PUBLIC_PLEX_PORT;
const LOCAL_PLEX_PORT = process.env.PLEX_PORT || 32400;
const LOCAL_JELLYFIN_PORT = process.env.JELLYFIN_PORT || 8096;
const SSH_USER = process.env.SSH_USER || 'Mingjie.Zhu22';
// =========================

app.set('trust proxy', true);

// 简单日志函数
function appLog(...args) {
  const ts = new Date().toISOString();
  console.log('[app]', ts, ...args);
}

// HTTP请求日志
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));

// 获取本机 IPv4 地址（第一个非 internal）
function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const family = typeof net.family === 'string' ? net.family : String(net.family);
      if (family.includes('4') && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

// ---------- 页面路由 ----------

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const lan_ip = getLocalIPv4();
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Plex Gateway</title>
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

      .buttons {
        display: grid;
        grid-template-columns: repeat(2, minmax(140px, 220px));
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
        align-items: center;
      }

      button {
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
    <p>Select how you want to access your Plex server:</p>

    <div class="buttons" role="group" aria-label="Gateway buttons">
      <button onclick="window.location='/local/plex'">PLEX Local</button>
      <button onclick="window.location='${PUBLIC_PLEX_URL}'">PLEX Public</button>
      <button onclick="window.location='/local/jellyfin'">JELLYFIN Local</button>
      <button onclick="window.location='${PUBLIC_JELLYFIN_URL}'">JELLYFIN Public</button>
      <button onclick="window.location='vnc://${lan_ip}'">desktop</button>
      <button class="btn-ssh" onclick="copySSHCommand()">SSH Tunnel</button>
    </div>

    <script>
      function copySSHCommand() {
        // 这里的 ${lan_ip} 会在后端渲染时替换为服务器的真实 IP
        const ip = "${lan_ip}";
        const user = "${SSH_USER}"; // 你可以根据需要把 user 改成变量
        const command = \`ssh -N -L 18789:127.0.0.1:18789 \${user}@\${ip}\`;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(command).then(() => {
          alert("SSH 命令已复制到剪贴板！\\n\\n" + command);
        }).catch(err => {
          console.error('无法复制: ', err);
          alert("复制失败，请手动查阅控制台。");
        });
      }
    </script>

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

      .button-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(140px, 260px));
        gap: 12px;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
      }

      .button-grid button {
        font-size: 1.4rem;
        font-weight: bold;
        background: radial-gradient(circle, #ff0000, #ff9900, #ffff00);
        border: 5px outset #fff;
        border-radius: 10px;
        color: #000;
        padding: 12px 18px;
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
    <p>Choose your gateway below:</p>
    <div class="button-grid" role="group" aria-label="Fashion gateway buttons">
      <button onclick="window.location='/local'">Plex Local</button>
      <button onclick="window.location='${PUBLIC_PLEX_URL}'">Plex Public</button>
      <button onclick="window.location='/local/jellyfin'">Jellyfin Local</button>
      <button onclick="window.location='${PUBLIC_JELLYFIN_URL}'">Jellyfin Public</button>
    </div>
    <marquee direction="right" behavior="scroll" scrollamount="7">⚡ Fast! ⚡ Secure! ⚡ Totally 1999! ⚡</marquee>
    <footer>© 1999-2025 Soysacue Zhu™ | Best viewed in Internet Explorer 6 | <blink>Under Construction 🚧</blink></footer>
  </body>
</html>`);
});

// 内网跳转
app.get('/local/plex', (req, res) => {
  const ip = getLocalIPv4();
  const url = `http://${ip}:${LOCAL_PLEX_PORT}/`;
  appLog('Redirecting to local Plex:', url);
  res.redirect(url);
});

// 内网跳转 Jellyfin
app.get('/local/jellyfin', (req, res) => {
  const ip = getLocalIPv4();
  const url = `http://${ip}:${LOCAL_JELLYFIN_PORT}/`;
  appLog('Redirecting to local Jellyfin:', url);
  res.redirect(url);
});

app.listen(PORT, () => {
  const ip = getLocalIPv4();
  appLog(`Server listening on port ${PORT}`);
  appLog(`Local Plex redirect target: http://${ip}:${LOCAL_PLEX_PORT}/`);
  appLog(`Public Plex link: ${PUBLIC_PLEX_URL}`);
});
