# Project Structure

```
ai-image-studio/
│
├── frontend/                    # React.js Frontend
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation component
│   │   ├── pages/
│   │   │   ├── Generate.js     # Main generation page
│   │   │   ├── Metrics.js      # Metrics and charts page
│   │   │   └── About.js        # About page
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles with Tailwind
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS configuration
│
├── backend/                     # Node.js + Express.js Backend
│   ├── server.js               # Express server
│   ├── package.json            # Backend dependencies
│   ├── env.template            # Environment variables template
│   └── .gitignore
│
├── model-server/                # FastAPI Python Model Server
│   ├── server.py               # FastAPI server with model loading
│   ├── requirements.txt        # Python dependencies
│   ├── README.md               # Model integration instructions
│   └── .gitignore
│
├── model/                       # Model Checkpoint Directory
│   └── (your_model.pth)        # Place your .pth checkpoint here
│
├── README.md                    # Main project documentation
├── SETUP.md                     # Detailed setup instructions
└── .gitignore                   # Git ignore rules

```

## Data Flow

```
User (Browser)
    ↓
React Frontend (localhost:3000)
    ↓ POST /api/generate
Express Backend (localhost:5000)
    ↓ POST /generate
FastAPI Model Server (localhost:8000)
    ↓ Load .pth checkpoint
    ↓ Generate images
    ↓ Return base64 images
Express Backend
    ↓ Save to MongoDB
    ↓ Return images
React Frontend
    ↓ Display in grid
    ↓ Download functionality
```

## Key Files

### Frontend
- **Generate.js**: Main page with image upload, generation controls, and result display
- **Metrics.js**: Charts and metrics visualization using Recharts
- **About.js**: Model architecture and training information
- **Navbar.js**: Navigation between pages

### Backend
- **server.js**: Express server with API endpoints, MongoDB connection, and model server communication

### Model Server
- **server.py**: FastAPI server that loads the .pth checkpoint and generates images
  - **IMPORTANT**: You must integrate your actual model code here

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MODEL_SERVER_URL=http://localhost:8000
```

## API Endpoints

### Express Backend
- `GET /api/health` - Health check
- `POST /api/generate` - Generate images (multipart/form-data)
- `GET /api/history` - Get generation history

### FastAPI Model Server
- `GET /` - Server info
- `GET /health` - Health check
- `POST /generate` - Generate images (JSON with base64 image)

