import fetch from "node-fetch";

export default async function handler(req, res) {
  const youtubeUrl = req.url.split("url=")[1];
  if (!youtubeUrl) return res.status(400).json({ success: false, message: "No URL provided" });

  try {
    // Prepare POST body exactly like the website
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

    return res.status(200).json({
      success: true,
      downloadUrl: data?.data?.downloadUrl || null
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
