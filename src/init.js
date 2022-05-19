//& database, video를 import해주고 application을 작동시킬 파일
import "./db";
import "./models/video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
