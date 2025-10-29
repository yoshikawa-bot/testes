import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided" });
  }

  try {
    // 1️⃣ Get a random CDN
    const cdnResp = await axios.get("https://media.savetube.me/api/random-cdn");
    const cdn = cdnResp.data?.cdn || "cdn401.savetube.vip";

    // 2️⃣ Get video info
    const infoResp = await axios.post(
      `https://${cdn}/v2/info`,
      { url },
      {
        headers: {
          "Content-Type": "application/json",
          Origin: "https://y.savetube.me",
          Referer: "https://y.savetube.me",
        },
      }
    );
    const key = infoResp.data?.data;

    if (!key) {
      return res.status(500).json({ success: false, message: "Failed to get video key" });
    }

    // 3️⃣ Get download URL
    const downloadResp = await axios.post(
      `https://${cdn}/download`,
      {
        downloadType: "audio",
        quality: "128",
        key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Origin: "https://y.savetube.me",
          Referer: "https://y.savetube.me",
        },
      }
    );

    const downloadUrl = downloadResp.data?.data?.downloadUrl || null;

    if (!downloadUrl) {
      return res.status(500).json({ success: false, message: "Download URL not found" });
    }

    return res.status(200).json({ success: true, downloadUrl });
  } catch (err) {
    console.error("Error fetching download URL:", err.message || err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
