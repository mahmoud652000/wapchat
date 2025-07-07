document.getElementById("joinBtn").addEventListener("click", () => {
  const name = document.getElementById("guestName").value.trim();
  if (!name) return alert("من فضلك أدخل اسم");

  localStorage.setItem("guestName", name);
  window.location.href = "chat.html";
});
