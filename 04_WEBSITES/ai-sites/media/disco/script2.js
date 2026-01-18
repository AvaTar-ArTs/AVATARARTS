const songs = [
  {
    title: "Beautiful Mess",
    name: "Unknown Artist",
    source: "/Users/steven/Music/suno/mp3/Beautiful Mess.mp3",
    analysis: "/Users/steven/Music/suno/txt/Beautiful Mess_analysis.txt",
    transcript: "/Users/steven/Music/suno/txt/Beautiful Mess_transcript.txt",
    image: "https://via.placeholder.com/150", // Placeholder image
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Whisper of the Willow",
    name: "Unknown Artist",
    source: "/Users/steven/Music/suno/mp3/Whisper of the Willow.mp3",
    analysis: "/Users/steven/Music/suno/txt/Whisper of the Willow_analysis.txt",
    transcript: "/Users/steven/Music/suno/txt/Whisper of the Willow_transcript.txt",
    image: "https://via.placeholder.com/150", // Placeholder image
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  // Add more song objects as needed...
];

// Function to display songs on the page
const playlistDiv = document.getElementById('playlist');

songs.forEach(song => {
  const songDiv = document.createElement('div');
  songDiv.classList.add('song');
  
  songDiv.innerHTML = `
    <img src="${song.image}" alt="${song.title} Album Art">
    <h3>${song.title} by ${song.name}</h3>
    <p>${song.description}</p>
    <p><a href="${song.source}" target="_blank">Play Song</a></p>
    <p><a href="${song.analysis}" target="_blank">Read Analysis</a></p>
    <p><a href="${song.transcript}" target="_blank">Read Transcript</a></p>
  `;

  playlistDiv.appendChild(songDiv);
});
