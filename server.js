import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "YOUR_API_KEY"
});

app.post("/api/ideas", async (req, res) => {
  const { niche, platform, tone, audience, count, details } = req.body;

  try {
    const prompt = `
أنت خبير عالمي في صناعة المحتوى.
أعطني ${count || 5} أفكار محتوى احترافية باللغة العربية.

المجال: ${niche}
المنصة: ${platform}
الأسلوب: ${tone}
الجمهور المستهدف: ${audience}
تفاصيل إضافية: ${details || "لا يوجد"}

أريد النتيجة بصيغة JSON array فقط بهذا الشكل:
[
  {
    "title": "عنوان الفكرة",
    "description": "وصف مختصر للفكرة",
    "hook": "جملة افتتاحية جذابة",
    "cta": "دعوة لاتخاذ إجراء"
  }
]
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const text = response.output_text;
    const ideas = JSON.parse(text);

    res.json({ ideas });
  } catch (error) {
    res.status(500).json({
      error: error.message || "حدث خطأ في الخادم"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
