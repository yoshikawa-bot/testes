import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.url.split("url=")[1];
  if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

  try {
    // 1. Get a random CDN
    const cdnResp = await fetch("https://media.savetube.me/api/random-cdn");
    const cdnData = await cdnResp.json();
    const cdn = cdnData?.cdn || "cdn402.savetube.vip";

    // 2. Start download
    const startResp = await fetch(`https://${cdn}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://ytube.savetube.me"
      },
      body: JSON.stringify({ url })
    });
    const startData = await startResp.json();

    // 3. Return the download URL
    return res.status(200).json({
      success: true,
      downloadUrl: startData?.data?.downloadUrl || null
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
      }
