// === Configuration ===
const TELEGRAM_TOKEN = "8163872787:AAGVxQRrB-IHiKt6GLYp0dJL6FmR67X7tW0";
const TELEGRAM_CHAT_ID = "7079142411";

// === Form & Loading ===
const form = document.getElementById("visitingForm");
const loadingDiv = document.getElementById("loading");

// === Default Date ===
const uploadDateField = document.getElementById("uploadDate");
const today = new Date().toISOString().split("T")[0];
uploadDateField.value = today;

// === Helper: Format Date ===
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// === Helper: Send File to Telegram ===
async function sendFile(file) {
  if (!file) return;
  const formData = new FormData();
  formData.append("chat_id", TELEGRAM_CHAT_ID);
  formData.append("document", file);
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
      method: "POST",
      body: formData
    });
  } catch (err) {
    console.error("❌ File Upload Error:", err);
  }
}

// === Form Submit ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loadingDiv.style.display = "flex";

  const data = {
    uploadDate: formatDate(uploadDateField.value),
    category: document.getElementById("category").value,
    mobile1: document.getElementById("mobile1").value,
    mobile2: document.getElementById("mobile2").value,
    mobile3: document.getElementById("mobile3").value,
    mobile4: document.getElementById("mobile4").value,
    comment: document.getElementById("comment").value
  };

  const csvLine = [
    data.uploadDate,
    data.category,
    data.mobile1,
    data.mobile2,
    data.mobile3,
    data.mobile4,
    data.comment
  ].map(v => `"${v}"`).join(",");

  const textMessage =
    `📇 Visiting Card Manager\n\n` +
    `📅 আপলোডের তারিখ: ${data.uploadDate}\n` +
    `🏷️ বিভাগ: ${data.category}\n` +
    `📞 মোবাইল-১: ${data.mobile1}\n` +
    `📞 মোবাইল-২: ${data.mobile2}\n` +
    `📞 মোবাইল-৩: ${data.mobile3}\n` +
    `📞 মোবাইল-৪: ${data.mobile4}\n` +
    `📝 মন্তব্য:\n${data.comment}\n\n` +
    `📊 CSV Data:\n${csvLine}`;

  try {
    // === Send text ===
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: textMessage })
    });

    // === Upload up to 10 files ===
    for (let i = 1; i <= 10; i++) {
      const fileInput = document.getElementById(`file${i}`);
      if (fileInput && fileInput.files.length > 0) {
        await sendFile(fileInput.files[0]);
      }
    }

    alert("✅ তথ্য সফলভাবে সাবমিট হয়েছে!");
    form.reset();
    uploadDateField.value = today;

  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ ডেটা পাঠাতে সমস্যা হয়েছে!");
  } finally {
    loadingDiv.style.display = "none";
  }
});
