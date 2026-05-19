import zipfile, re
from pathlib import Path

p = Path(r"c:\Users\tihj\Downloads\프로젝트2030_후원안내서_v13.docx")
z = zipfile.ZipFile(p)
xml = z.read("word/document.xml").decode("utf-8")
text = "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml))
out = Path(__file__).parent / "_guide_full.txt"
out.write_text(text, encoding="utf-8")
for key in ["프로젝트 2030", "대선", "기후 정부", "226", "ESG", "암스테르담"]:
    i = text.find(key)
    print(key, i)
