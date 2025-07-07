document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorText = document.getElementById("error");

  if (!email || !password) {
    errorText.textContent = "يرجى ملء جميع الحقول";
    errorText.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch("http://localhost:3005/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.message || "حدث خطأ";
      errorText.classList.remove("hidden");
    } else {
      // حفظ التوكن واسم المستخدم في localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.name);
      // الذهاب إلى صفحة الشات
      window.location.href = "chat.html";
    }
  } catch (err) {
    errorText.textContent = "فشل الاتصال بالسيرفر";
    errorText.classList.remove("hidden");
    console.error(err);
  }
});
