const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`=====================================================`);
  console.log(`🚀 Mangalam Travel & Tours Node.js Backend Server`);
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Network URL: http://127.0.0.1:${PORT}`);
  console.log(`🛠️ Admin Panel running at: http://localhost:${PORT}/admin/`);
  console.log(`📦 Data Mode: Stateful In-Memory Store (No MySQL active)`);
  console.log(`=====================================================`);
});
