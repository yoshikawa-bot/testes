import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided" });
  }

  try {
    // The SaveTube download endpoint from your screenshots
    const response = await fetch("https://cdn400.savetube.vip/download", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "origin": "https://ytube.savetube.me",
        "referer": "https://ytube.savetube.me",
      },
      body: JSON.stringify({
        from: "youtube-to-mp3-download-now",
        url: url
      }),
    });

    const data = await response.json();

    // Return only downloadUrl
    const downloadUrl = data?.data?.downloadUrl || null;

    res.status(200).json({ success: true, downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
