const socket = io('http://localhost:3000');

socket.on('connect', () => {
  socket.emit('join', 'test-room');
});

socket.on('message', (data) => {
  console.log('Message: ', data);
});

const slider = document.getElementById('slider');
const bars = document.querySelectorAll('.bar-percentage');
const circle = document.querySelector('.circle-percentage');

const adjustBarPercentage = function adjustBarPercentage(value) {
  bars.forEach((bar, idx) => {
    bar.style.clipPath = `inset(${100 - value + (25 * idx)}% 0% 0% 0%)`;
  });
};

const adjustCirclePercentage = function adjustCirclePercentage(value) {
  circle.style.clipPath = `polygon(50% 50%, 100% 0%, 100% ${value}%)`;
};

slider.onchange = (e) => {
  const percentage = e.target.value;
  console.log(percentage);
  socket.emit('user-input', 'test-room', percentage);
};

const circleBottomRight = function circleBottomRight(m) {
  const y = 100 * m;
  console.log('y coord:', y);
  circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% ${y + 100}px, 100% 100%, 0% 100%, 0% 0%, 100% 0%)`;
};

const circleBottom = function circleBottom(m) {
  const x = 100 / m;
  console.log('x coord:', x);
  circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 100%, 100% 100%, ${x + 100}px 100%`;
};

const circleLeft = function circleLeft(m) {
  const y = -100 * m;
  console.log('y coord:', y);
  circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 100%, 0% 100%, 0% ${y + 100}px`;
};

const circleTop = function circleTop(m) {
  const x = -100 / m;
  console.log('x coord:', x);
  circle.style.clipPath = `polygon(50% 50%, 100% 50%,  100% 50%, 100% 100%, 0% 100%, 0% 0%, ${x + 100}px 0%`;
};

const circleTopRight = function circleTopRight(m) {
  const y = 100 * m;
  console.log('y coord:', y);
  circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%, 100% 0%, 100% ${y + 100}px`;
};

const updateCirclePercentage = function updateCirclePercentage(degrees) {
  switch (degrees) {
    case 45:
      return circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 50% 100%, 100% 100%)`;
    case 90:
      return circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 100%, 50% 100%)`;
    case 270:
      return circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 0%)`;
    case 360:
      return circle.style.clipPath = `polygon(50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 49.5%)`;
    default:
      break;
  }
  const slope = Math.round(Math.tan(degrees * Math.PI / 180) * 1000) / 1000;
  if (degrees < 45) {
    return circleBottomRight(slope);
  } else if (degrees < 135) {
    return circleBottom(slope);
  } else if (degrees < 225) {
    return circleLeft(slope);
  } else if (degrees < 315) {
    return circleTop(slope);
  } else if (degrees < 360) {
    return circleTopRight(slope);
  }
};

socket.on('update-chart', (data) => {
  const percentage = parseInt(data, 10);
  const degrees = percentage * 3.60;
  console.log('New Percentage: ', percentage);
  if (percentage === slider.value) return;
  slider.value = percentage;
  console.log('degrees: ', degrees);
  updateCirclePercentage(degrees);
  console.log(circle.style.clipPath);
  adjustBarPercentage(percentage);
});
