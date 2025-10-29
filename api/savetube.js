import fetch from "node-fetch";

export default async function handler(req, res) {
  const youtubeUrl = req.url.split("url=")[1];
  if (!youtubeUrl) return res.status(400).send("No URL provided");

  try {
    const body = {
      url: youtubeUrl,
      from: "youtube-to-mp3-download-now"
    };

    const response = await fetch("https://cdn400.savetube.vip/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://ytube.savetube.me",
        "Origin": "https://ytube.savetube.me"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    // Send only the download URL string
    return res.status(200).send(data?.data?.downloadUrl || "Download URL not found");

  } catch (err) {
    return res.status(500).send("Error fetching download URL");
  }
}
