import subprocess
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

files = [
    {"name": "class-6-computer-science", "id": "1oi7PgYJ5L0oqcBIGbt1GgOEl6fOArJjS", "title": "Computer Science"},
    {"name": "class-6-english", "id": "1yN2sMr19VApyDezN8ez1BB8z-36Yy0E7", "title": "English Olympiad"},
    {"name": "class-6-reasoning", "id": "1rYuFBJ1Z83_LLM3gnk2xmgDMy65pVoNk", "title": "Reasoning / General Knowledge"},
    {"name": "class-6-mathematics", "id": "1dtyV_iYQkHAyrvxjDvGLAQQfK7aK-RDX", "title": "Mathematics 6"},
    {"name": "class-6-science", "id": "1rKWcl3fuWON1MerpVFMf3Y5X4b7hDGWL", "title": "Science Olympiad"},
]

out_dir = os.path.join(os.getcwd(), "public", "pdfs")
os.makedirs(out_dir, exist_ok=True)

for item in files:
    fid = item["id"]
    pdf_out = os.path.join(out_dir, f"{item['name']}.pdf")
    docx_out = os.path.join(out_dir, f"{item['name']}.docx")
    
    print(f"\n--- Processing {item['title']} (ID: {fid}) ---")
    
    # Try 1: Google Docs PDF export
    url_pdf = f"https://docs.google.com/document/d/{fid}/export?format=pdf"
    cmd = ["curl.exe", "-s", "-L", "-A", "Mozilla/5.0", url_pdf, "-o", pdf_out]
    subprocess.run(cmd)
    
    # Check if downloaded file is a valid PDF (starts with %PDF)
    is_pdf = False
    if os.path.exists(pdf_out):
        with open(pdf_out, "rb") as f:
            header = f.read(5)
            if header.startswith(b"%PDF"):
                is_pdf = True
                print(f"[OK] Downloaded valid PDF: {item['name']}.pdf ({os.path.getsize(pdf_out)} bytes)")
            else:
                print(f"[WARN] Not direct PDF export, header was: {header}")
                
    if not is_pdf:
        # Try 2: Direct file download (e.g. .docx)
        url_docx = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
        cmd = ["curl.exe", "-s", "-L", "-A", "Mozilla/5.0", url_docx, "-o", docx_out]
        subprocess.run(cmd)
        if os.path.exists(docx_out) and os.path.getsize(docx_out) > 1000:
            print(f"[OK] Downloaded DOCX: {item['name']}.docx ({os.path.getsize(docx_out)} bytes)")
        else:
            url_alt = f"https://drive.google.com/uc?export=download&id={fid}"
            cmd = ["curl.exe", "-s", "-L", "-A", "Mozilla/5.0", url_alt, "-o", docx_out]
            subprocess.run(cmd)
            print(f"Downloaded DOCX via alt: {item['name']}.docx ({os.path.getsize(docx_out)} bytes)")

print("\n--- Finished Downloading Class 6 Files ---")
