---
title: Obhoy Backend
emoji: 🧠
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Moner-Bondhu Backend API

A sophisticated FastAPI-based backend service for the Moner-Bondhu mental health chatbot application. This service integrates emotion classification, intent detection, knowledge retrieval (RAG), and Google Gemini AI to provide intelligent, empathetic mental health support.

## 🌟 Features

### Core AI Components
- **Emotion Classification**: Fine-tuned BERT model classifying text into 6 emotion categories
- **Intent Detection**: BERT-based intent classifier for understanding user needs
- **Knowledge Retrieval (RAG)**: ChromaDB vector store with mental health resources
- **Fusion Layer**: Intelligent combination of emotion, intent, and context
- **Gemini AI Integration**: Google's advanced language model for natural responses

### Additional Features
- **RESTful API**: Clean FastAPI implementation with proper schemas
- **Health Monitoring**: Endpoint to check model loading status
- **Error Handling**: Comprehensive error responses and logging
- **Environment Configuration**: Secure API key management with .env files

## 🎯 Emotion Categories

The emotion classifier identifies 6 emotional states:
1. **Sadness** - Feelings of sadness, depression, or being down
2. **Joyful** - Positive emotions, happiness, and contentment
3. **Love** - Affection, care, and positive relationships
4. **Anger** - Frustration, irritation, and anger
5. **Fear** - Anxiety, worry, and fearful feelings
6. **Surprise** - Unexpected emotions and reactions

## 🔄 Intent Categories

The intent classifier detects user intentions:
- **Greeting** - Hello, hi, good morning/evening
- **Seek Support** - Asking for help, emotional support
- **Information** - Requesting mental health information
- **Goodbye** - Ending conversation, farewell
- **Smalltalk** - Casual conversation
- **Affirmation** - Positive acknowledgments

## 📡 API Endpoints

### POST `/api/v/chat`

Main chat endpoint with emotion-aware, context-enhanced responses powered by Gemini AI.

**Request Body:**
```json
{
  "prompt": "I'm feeling really anxious about my upcoming exams and can't sleep."
}
```

**Response:**
```json
{
  "response": "I understand you're feeling anxious about your exams, and it's completely normal to feel this way. The sleeplessness you're experiencing is often connected to anxiety. Try some deep breathing exercises before bed and consider breaking your study sessions into smaller, manageable chunks."
}
```

### GET `/health`

Health check endpoint to monitor system status.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": {
    "emotion_model": true,
    "emotion_tokenizer": true,
    "intent_model": true,
    "intent_tokenizer": true
  }
}
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI application with Gemini integration
│   ├── schemas.py                 # Pydantic request/response models
│   ├── fusionLayer.py            # AI fusion layer for combining models
│   ├── createKB.py               # Knowledge base creation script
│   ├── intent_model/             # Intent model tokenizer files
│   │   ├── special_tokens_map.json
│   │   ├── tokenizer_config.json
│   │   ├── tokenizer.json
│   │   └── vocab.txt
│   ├── assets/                   # Mental health PDF resources
│   │   ├── anxiety-self-help.pdf
│   │   ├── trauma-informed-care.pdf
│   │   └── mental-health-considerations.pdf
│   └── chroma_db/               # Vector database for RAG
├── bert_model_corrected.pt       # Fine-tuned BERT emotion classifier
├── intent_model.pt              # BERT-based intent classifier
├── requirements.txt             # Python dependencies
├── start.sh                     # Automated startup script
├── .env.example                 # Environment variables template
├── .env                         # Environment configuration (in .gitignore)
└── README.md                    
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Virtual environment (recommended)
- Google Gemini API key

### Step 1: Clone and Navigate
```bash
git clone https://github.com/FarhanTausif/Moner-Bondhu.git
cd Moner-Bondhu/backend
```

### Step 2: Environment Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Copy environment template
cp .env.example .env

# Edit .env file and add your Gemini API key
nano .env  # Add: GEMINI_API_KEY=your_api_key_here
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Start the Server
```bash
# Using the automated script (recommended)
chmod +x start.sh
./start.sh

# Or manually
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## 📦 Dependencies

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: Lightning-fast ASGI server

### AI/ML Libraries
- **PyTorch**: Deep learning framework for model inference
- **Transformers**: Hugging Face library for BERT models
- **google-generativeai**: Google Gemini AI integration
- **sentence-transformers**: Embedding models for RAG

### Data & Storage
- **ChromaDB**: Vector database for knowledge retrieval
- **LangChain**: Framework for RAG implementation
- **python-dotenv**: Environment variable management

### Utilities
- **Pydantic**: Data validation and serialization
- **PyPDF2**: PDF processing for knowledge base

## 🧠 AI Architecture

### Data Flow
1. **User Input** → Emotion & Intent Classification
2. **Knowledge Retrieval** → Relevant mental health resources from vector DB
3. **Fusion Layer** → Combines emotion, intent, and context
4. **Enhanced Prompt** → Structured prompt for Gemini AI
5. **Gemini Response** → Natural, empathetic mental health support

### Model Information
- **Emotion Model**: Fine-tuned BERT-base-uncased (6 classes)
- **Intent Model**: BERT-based classification (6 intents)
- **Embedding Model**: all-MiniLM-L6-v2 for RAG
- **Language Model**: Google Gemini Pro for response generation

## 📚 Knowledge Base

The system includes a curated knowledge base of mental health resources:
- Anxiety self-help guides
- Trauma-informed care information
- Mental health considerations
- Safety conversation guidelines

### Creating/Updating Knowledge Base
```bash
python app/createKB.py
```

## 🔧 API Documentation

Once the server is running, access:
- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## 🧪 Testing

### Example Test Requests

```bash
# Emotion Detection
curl -X POST "http://localhost:8000/api/v/chat" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I feel really sad and lonely today"}'

# Intent Recognition
curl -X POST "http://localhost:8000/api/v/chat" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Can you help me with anxiety management?"}'

# Health Check
curl -X GET "http://localhost:8000/health"
```

### Response Examples

**Emotional Support Response:**
```json
{
  "response": "I hear that you're feeling sad and lonely, and I want you to know that these feelings are valid and you're not alone in experiencing them. Loneliness can be really challenging, but reaching out like you just did is a positive step. Consider connecting with a trusted friend or family member, or explore local support groups in your community."
}
```

## 🔒 Security & Privacy

- **Environment Variables**: Secure API key storage
- **No Data Persistence**: User conversations are not stored
- **Error Handling**: Prevents sensitive information leakage
- **CORS Configuration**: Configurable for production deployment

## 🚀 Development

### Running in Development Mode
```bash
uvicorn app.main:app --reload --port 8000 --log-level debug
```

### Adding New Features
1. Update models in `app/fusionLayer.py`
2. Modify API endpoints in `app/main.py`
3. Add schemas in `app/schemas.py`
4. Update knowledge base in `app/createKB.py`

### Environment Variables
Create a `.env` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📈 Production Deployment

### Recommended Setup
- **Server**: Gunicorn with Uvicorn workers
- **Environment**: Docker containerization
- **Database**: Persistent ChromaDB storage
- **Monitoring**: Health check endpoints
- **Security**: HTTPS, API rate limiting

### Docker Deployment
```bash
# Build image
docker build -t moner-bondhu-backend .

# Run container
docker run -p 8000:8000 --env-file .env moner-bondhu-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Add comprehensive error handling
- Include docstrings for all functions
- Test all API endpoints thoroughly
- Update documentation for new features

For technical support, please create an issue in the GitHub repository.

---

**Made with 💙 for mental health awareness in Bangladesh**