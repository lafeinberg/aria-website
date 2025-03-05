const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const centerImage = document.querySelector(".center-image");
const stopButton = document.getElementById("stopButton");
const goToPageButton = document.getElementById("goToPage");

const sections = [
  { label: "About", url: "AboutMe/aboutme.html", icon: "about.png" },
  { label: "Videos", url: "portfolio_page/video-portfolio.html", icon: "gallery.png" },
  { label: "Services", url: "../services.html", icon: "services.png" },
  { label: "Resume", url: "resume/resume.html", icon: "contact.png" },
  { label: "Portfolio", url: "../index.html", icon: "portfolio.png" }
];

// 🛠️ Increase Canvas Size (Bigger Wheel)
canvas.width = 600; // Updated from 400
canvas.height = 600; // Updated from 400

const numSections = sections.length;
const arc = (2 * Math.PI) / numSections;
let rotation = 0;
let spinSpeed = 0;
let spinning = false;
let selectedIndex = null;
let iconPositions = [];

// 🎨 Draw the Wheel with Larger Radius
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(300, 300); // Move center of wheel to the middle of the new canvas
  ctx.rotate(rotation);
  ctx.translate(-300, -300);

  iconPositions = [];

  for (let i = 0; i < numSections; i++) {
    const startAngle = i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.moveTo(300, 300); // Updated center
    ctx.arc(300, 300, 290, startAngle, endAngle); // Increased radius
    ctx.closePath();

    ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Transparent section
    ctx.fill();

    ctx.strokeStyle = "rgba(198, 198, 198, 0.2)"; // Faint lines
    ctx.lineWidth = 1;
    ctx.stroke();

    // 🏷️ Add Text (Now Black)
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial"; // Increased font size
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = 300 + Math.cos(startAngle + arc / 2) * 200; // Move text out
    const textY = 300 + Math.sin(startAngle + arc / 2) * 200;
    ctx.fillText(sections[i].label, textX, textY - 20);

    // 🖼️ Load PNG Icons (Always Facing Up)
    const img = new Image();
    img.src = `icons/${sections[i].icon}`;
    img.onload = function () {
      ctx.drawImage(img, textX - 20, textY, 40, 40); // Increased icon size
    };

    // Store icon positions for click detection
    iconPositions.push({ x: textX - 20, y: textY, width: 40, height: 40, url: sections[i].url });
  }

  ctx.restore();
}


// 🌀 Start the Spinner (Triggered by Clicking the Center Icon)
function startSpin() {
  if (spinning) return;

  spinning = true;
  spinSpeed = Math.random() * 0.3 + 0.4; // Start faster
  stopButton.style.display = "block"; // Show stop button
  goToPageButton.style.display = "none"; // Hide navigation button while spinning

  function animateSpin() {
    if (!spinning) return;

    rotation += spinSpeed;
    drawWheel();

    requestAnimationFrame(animateSpin);
  }

  requestAnimationFrame(animateSpin);
}

// 🛑 Stop the Spinner (Stops Faster Now)
function stopSpin() {
  if (!spinning) return;

  let slowDown = setInterval(() => {
    spinSpeed *= 0.80; // Reduce speed even faster

    if (spinSpeed < 0.01) {
      spinSpeed = 0;
      spinning = false;
      clearInterval(slowDown);

      // 🎯 Ensure the section at the TOP (90°) is selected
      let finalAngle = (rotation % (2 * Math.PI));
      let indexOffset = Math.floor(((2 * Math.PI - finalAngle) / arc) + 0.5) % numSections;
      selectedIndex = indexOffset;

      console.log("Selected Section:", sections[selectedIndex].label);

      // 🎉 Show "Go to Page" button
      goToPageButton.style.display = "block";
    }
  }, 25); // Faster stop
}

// 🖱️ Detect Clicks on Icons
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  for (let icon of iconPositions) {
    if (
      clickX >= icon.x &&
      clickX <= icon.x + icon.width &&
      clickY >= icon.y &&
      clickY <= icon.y + icon.height
    ) {
      window.location.href = icon.url; // Navigate when an icon is clicked
    }
  }
});

// 🌍 Navigate to Selected Page (Only when clicking the button)
goToPageButton.addEventListener("click", () => {
  if (selectedIndex !== null) {
    window.location.href = sections[selectedIndex].url;
  }
});

// 🖱️ Click Center Icon to Start Spin
centerImage.addEventListener("click", startSpin);
stopButton.addEventListener("click", stopSpin);

// 🔃 Draw Initial Wheel
drawWheel();
