import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided" });
  }

  try {
    // 1️⃣ Get a random CDN
    const cdnResp = await fetch("https://media.savetube.me/api/random-cdn");
    const cdnData = await cdnResp.json();
    const cdn = cdnData?.cdn || "cdn401.savetube.vip";

    // 2️⃣ Get video info
    const infoResp = await fetch(`https://${cdn}/v2/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://y.savetube.me",
        Referer: "https://y.savetube.me",
      },
      body: JSON.stringify({ url }),
    });
    const infoData = await infoResp.json();
    if (!infoData?.data) {
      return res.status(500).json({ success: false, message: "Failed to get video key" });
    }
    const key = infoData.data; // encoded key from /v2/info

    // 3️⃣ Get download URL
    const downloadResp = await fetch(`https://${cdn}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://y.savetube.me",
        Referer: "https://y.savetube.me",
      },
      body: JSON.stringify({
        downloadType: "audio",
        quality: "128",
        key,
      }),
    });
    const downloadData = await downloadResp.json();
    const downloadUrl = downloadData?.data?.downloadUrl || null;

    if (!downloadUrl) {
      return res.status(500).json({ success: false, message: "Download URL not found" });
    }

    return res.status(200).json({ success: true, downloadUrl });
  } catch (err) {
    console.error("Error fetching download URL:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
