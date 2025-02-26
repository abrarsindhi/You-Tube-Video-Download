async function fetchVideo() {
    const videoURL = document.getElementById("videoURL").value;
    
    if (!videoURL) {
        alert("Please enter a valid YouTube URL.");
        return;
    }

    const response = await fetch(`http://localhost:5000/getVideo?url=${encodeURIComponent(videoURL)}`);
    const data = await response.json();

    if (data.error) {
        alert("Error fetching video. Try again.");
        return;
    }

    document.getElementById("videoTitle").innerText = data.title;
    document.getElementById("videoThumbnail").src = data.thumbnail;
    
    const qualityOptions = document.getElementById("qualityOptions");
    qualityOptions.innerHTML = "";
    
    data.formats.forEach(format => {
        const option = document.createElement("option");
        option.value = format.url;
        option.innerText = `${format.qualityLabel} (${format.mimeType})`;
        qualityOptions.appendChild(option);
    });

    document.getElementById("videoInfo").classList.remove("hidden");
}

function downloadVideo() {
    const selectedURL = document.getElementById("qualityOptions").value;
    window.open(selectedURL, "_blank");
}
