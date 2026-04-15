const submitApplication = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: credit._id, // ID кредита
        name: name,
        phone: phone,
        email: email,
      }),
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Ошибка при отправке заявки");
  }
};
