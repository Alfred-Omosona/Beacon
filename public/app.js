async function loadReleaseInformation() {
  const statusText = document.querySelector("#status-text");
  const statusDot = document.querySelector("#status-dot");

  try {
    const [healthResponse, infoResponse] = await Promise.all([
      fetch("/health"),
      fetch("/api/info"),
    ]);

    if (!healthResponse.ok || !infoResponse.ok) throw new Error("Service check failed");

    const health = await healthResponse.json();
    const info = await infoResponse.json();
    statusText.textContent = health.status === "ok" ? "Service healthy" : "Service degraded";
    statusDot.classList.add("online");
    document.querySelector("#environment").textContent = info.environment;
    document.querySelector("#release").textContent = info.release;
    document.querySelector("#runtime").textContent = info.nodeVersion;
  } catch (error) {
    statusText.textContent = "Service unavailable";
    statusDot.classList.add("offline");
    console.error(error);
  }
}

loadReleaseInformation();

