import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

    // 1️⃣ Get random CDN (optional, for simulation)
    const cdnResponse = await fetch("https://media.savetube.me/api/random-cdn");
    const cdnData = await cdnResponse.json();
    const cdn = cdnData.cdn || "cdn402.savetube.vip";

    // 2️⃣ Start the download (simulate the website flow)
    const startDownloadURL = `https://${cdn}/mnt/data/v3/CRT6EsR39S/RPdVW6ArY/en/start-download-json?from=youtube-to-mp3-download-now&url=${encodeURIComponent(url)}`;
    
    const downloadResponse = await fetch(startDownloadURL, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://ytube.savetube.me"
      }
    });
    
    const downloadData = await downloadResponse.json();

    if (!downloadData?.data?.downloadUrl) {
      return res.status(404).json({ success: false, message: "Download URL not found" });
    }

    // ✅ Return only the download URL
    return res.status(200).json({
      success: true,
      downloadUrl: downloadData.data.downloadUrl
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
