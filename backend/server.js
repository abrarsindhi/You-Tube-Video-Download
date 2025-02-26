const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/getVideo", (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL) {
        return res.json({ error: "No URL provided" });
    }

    exec(`yt-dlp -j ${videoURL}`, (error, stdout, stderr) => {
        if (error) {
            console.error("yt-dlp Error:", stderr);
            return res.json({ error: "Failed to fetch video details" });
        }

        try {
            const videoData = JSON.parse(stdout);
            const formats = videoData.formats
                .filter(f => f.ext === "mp4" && f.filesize)
                .map(f => ({
                    url: f.url,
                    qualityLabel: f.format_note,
                    mimeType: f.ext
                }));

            res.json({
                title: videoData.title,
                thumbnail: videoData.thumbnail,
                formats
            });
        } catch (err) {
            console.error("Parsing Error:", err);
            return res.json({ error: "Error processing video data" });
        }
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
