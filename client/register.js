document.getElementById("registerBtn").onclick = async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("تم التسجيل بنجاح");
    window.location.href = "login.html";
  } else {
    alert(data.message);
  }
};
// --------------------
document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("يرجى تعبئة جميع الحقول");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("تم التسجيل بنجاح ✅");
      // ممكن تحوّله لصفحة تسجيل الدخول
      window.location.href = "index.html";
    } else {
      alert(`خطأ: ${data.message || "حدث خطأ ما"}`);
    }
  } catch (err) {
    alert("فشل الاتصال بالسيرفر");
    console.error(err);
  }
});
