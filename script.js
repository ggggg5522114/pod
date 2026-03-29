const nicheInput = document.getElementById("niche");
const platformInput = document.getElementById("platform");
const toneInput = document.getElementById("tone");
const audienceInput = document.getElementById("audience");
const countInput = document.getElementById("count");
const detailsInput = document.getElementById("details");

const generateBtn = document.getElementById("generateBtn");
const exampleBtn = document.getElementById("exampleBtn");
const clearBtn = document.getElementById("clearBtn");

const statusBox = document.getElementById("status");
const resultsBox = document.getElementById("results");

function setStatus(message, type = "") {
  statusBox.className = "status";
  if (type) statusBox.classList.add(type);
  statusBox.textContent = message;
}

function renderEmpty() {
  resultsBox.innerHTML = `
    <div class="empty-box">
      <h4>لا توجد نتائج بعد</h4>
      <p>أدخل بياناتك ثم اضغط على زر إنشاء أفكار.</p>
    </div>
  `;
}

function renderIdeas(ideas) {
  if (!ideas || !ideas.length) {
    renderEmpty();
    return;
  }

  resultsBox.innerHTML = ideas.map((idea, index) => `
    <article class="idea-card">
      <h4>${index + 1}. ${idea.title || "فكرة محتوى"}</h4>
      <p>${idea.description || ""}</p>
      <div class="idea-meta">
        <span><strong>هوك البداية:</strong> ${idea.hook || "-"}</span>
        <span><strong>CTA:</strong> ${idea.cta || "-"}</span>
      </div>
    </article>
  `).join("");
}

async function generateIdeas() {
  const payload = {
    niche: nicheInput.value.trim(),
    platform: platformInput.value,
    tone: toneInput.value,
    audience: audienceInput.value.trim(),
    count: Number(countInput.value),
    details: detailsInput.value.trim()
  };

  if (!payload.niche) {
    setStatus("يرجى كتابة المجال أولاً.", "error");
    nicheInput.focus();
    return;
  }

  setStatus("جاري إنشاء أفكار احترافية...", "loading");
  generateBtn.disabled = true;

  try {
    const response = await fetch("http://localhost:3000/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "حدث خطأ أثناء إنشاء الأفكار.");
    }

    renderIdeas(data.ideas);
    setStatus("تم إنشاء الأفكار بنجاح.", "success");
  } catch (error) {
    setStatus(error.message || "تعذر الاتصال بالخادم.", "error");
    renderEmpty();
  } finally {
    generateBtn.disabled = false;
  }
}

exampleBtn.addEventListener("click", () => {
  nicheInput.value = "التسويق الرقمي";
  platformInput.value = "Instagram";
  toneInput.value = "إبداعي";
  audienceInput.value = "أصحاب المشاريع الصغيرة";
  countInput.value = "5";
  detailsInput.value = "أريد أفكار قصيرة، قوية، حديثة، ومناسبة للريلز وقابلة للانتشار.";
  setStatus("تمت تعبئة مثال جاهز.", "success");
});

clearBtn.addEventListener("click", () => {
  nicheInput.value = "";
  platformInput.value = "YouTube";
  toneInput.value = "احترافي";
  audienceInput.value = "";
  countInput.value = "5";
  detailsInput.value = "";
  renderEmpty();
  setStatus("تم مسح الحقول.", "");
});

generateBtn.addEventListener("click", generateIdeas);

renderEmpty();
