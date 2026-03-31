"""
Downloads BERT model weights from Google Drive before server startup.

To use:
1. Upload bert_model_corrected.pt and intent_model.pt to Google Drive
2. Share each file: "Anyone with the link can view"
3. Copy the file ID from the share URL:
   https://drive.google.com/file/d/FILE_ID/view
4. Replace the placeholder values below with your actual file IDs
"""

import os
import gdown

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS = {
    "bert_model_corrected.pt": "REPLACE_WITH_BERT_MODEL_FILE_ID",
    "intent_model.pt": "REPLACE_WITH_INTENT_MODEL_FILE_ID",
}

for filename, file_id in MODELS.items():
    dest = os.path.join(BASE_DIR, filename)
    if os.path.exists(dest):
        print(f"{filename} already exists, skipping download.")
        continue
    if file_id.startswith("REPLACE_"):
        print(f"WARNING: No Google Drive file ID set for {filename}. Skipping.")
        continue
    print(f"Downloading {filename} from Google Drive...")
    gdown.download(id=file_id, output=dest, quiet=False)
    print(f"{filename} downloaded to {dest}")
