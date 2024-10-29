useEffect(() => {
  console.log("accounts", accounts);
  if (accounts.length) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accounts[0]?.idToken}`);
    headers.append("Instance-ClientId", instance?.clientId || "");
    headers.append("Instance-Authority", instance?.authority || "");
    fetch("http://127.0.0.1:5000/authorization", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
}, [accessToken, instance]);
