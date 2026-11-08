const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const time = document.querySelector("#local-time");
if (time) {
  time.textContent = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

const imageForm = document.querySelector("#image-form");
if (imageForm) {
  const promptInput = document.querySelector("#image-prompt");
  const status = document.querySelector("#image-status");
  const result = document.querySelector("#image-result");
  const generatedImage = document.querySelector("#generated-image");
  const downloadLink = document.querySelector("#download-image");
  const submitButton = imageForm.querySelector("button[type='submit']");
  const buttonLabel = submitButton.querySelector(".button-label");
  let imageUrl;

  imageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    submitButton.disabled = true;
    buttonLabel.textContent = "Making your image…";
    status.textContent = "Sending your idea to Nano Banana 2. This can take a little bit.";
    status.classList.remove("is-error");
    result.hidden = true;

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed. Please try again.");

      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const binary = atob(data.image);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      imageUrl = URL.createObjectURL(new Blob([bytes], { type: data.mimeType || "image/png" }));
      generatedImage.src = imageUrl;
      downloadLink.href = imageUrl;
      downloadLink.download = `tiny-image-${Date.now()}.${(data.mimeType || "image/png").split("/")[1] || "png"}`;
      result.hidden = false;
      status.textContent = "Your image is ready. Like it? Save a copy below.";
    } catch (error) {
      status.textContent = error.message || "Something went wrong. Please try again.";
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      buttonLabel.textContent = "Generate image";
    }
  });
}
