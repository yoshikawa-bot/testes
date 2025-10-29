import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided" });
  }

  try {
    // Step 1: Get a random CDN
    const cdnRes = await axios.get("https://ytube.savetube.me/api/random-cdn");
    const cdn = cdnRes.data.cdn;

    // Step 2: Get video info
    const infoRes = await axios.post(`https://${cdn}/v2/info`, {
      url: url,
    }, {
      headers: {
        "Origin": "https://ytube.savetube.me",
        "Referer": "https://ytube.savetube.me",
        "Content-Type": "application/json"
      },
    });

    const key = infoRes.data.data; // the key for download request

    if (!key) {
      return res.status(404).json({ success: false, message: "Download key not found" });
    }

    // Step 3: Request download URL
    const downloadRes = await axios.post(`https://${cdn}/download`, {
      downloadType: "audio",
      quality: "128",
      key: key
    }, {
      headers: {
        "Origin": "https://ytube.savetube.me",
        "Referer": "https://ytube.savetube.me",
        "Content-Type": "application/json"
      },
    });

    const downloadUrl = downloadRes.data?.data?.downloadUrl || null;

    if (!downloadUrl) {
      return res.status(404).json({ success: false, message: "Download URL not found" });
    }

    return res.status(200).json({ success: true, downloadUrl });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
}
