# !pip install pymupdf langchain langchain-community chromadb sentence-transformers transformers accelerate
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
import os

# --- Step 1: Extract text ---
def extract_text_from_pdf(pdf_path: str) -> str:
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return ""
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(len(doc)):
        page_text = doc[page_num].get_text()
        if page_text.strip():
            text += f"\n\n--- Page {page_num+1} ---\n\n{page_text}"
    doc.close()
    return text

_assets_dir = os.path.join(os.path.dirname(__file__), "assests")
pdf_paths = [os.path.join(_assets_dir, "1636-CAMHS-Anxiety-self-help-A4-leaflet.pdf"),
             os.path.join(_assets_dir, "Fact-Sheet-What-is-Trauma-Informed-Care.pdf"),
             os.path.join(_assets_dir, "SHP_Better-Safety-Conversations.pdf"),
             os.path.join(_assets_dir, "mental-health-considerations.pdf")]
extracted_texts = {os.path.basename(p): extract_text_from_pdf(p) for p in pdf_paths if os.path.exists(p)}

# --- Step 2: Chunking ---
def create_chunks(text: str, source: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    chunks = splitter.split_text(text)
    return [Document(page_content=c, metadata={"source": source, "chunk_id": i}) for i, c in enumerate(chunks)]

documents = []
for source, text in extracted_texts.items():
    documents.extend(create_chunks(text, source))

print(f"Total chunks: {len(documents)}")

# --- Step 3: Build vector store ---
# persist_dir = "./content/mental_health_db"
# embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# vectorstore = Chroma.from_documents(
#     documents=documents,
#     embedding=embedding_model,
#     persist_directory=persist_dir,
#     collection_name="mental_health_knowledge"
# )
# vectorstore.persist()

# Set up ChromaDB knowledge base for study materials
persist_directory = os.path.join(os.path.dirname(__file__), "chroma_db")
embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Recreate vectorstore
vectorstore = Chroma.from_documents(
    documents=documents,
    embedding=embedding_model,
    persist_directory=persist_directory,
    collection_name="mental_health_knowledge_base"
)

# Persist the database
vectorstore.persist()
print(f"Knowledge base created with {len(documents)} chunks")
print(f"Database persisted to: {persist_directory}")
