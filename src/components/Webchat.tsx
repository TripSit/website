import * as React from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WidgetBot = dynamic(() => import("@widgetbot/react-embed"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const parameters =
  process.env.NODE_ENV === "production"
    ? {
        server: "179641883222474752",
        channel: "1021385869262864464",
        shard: "https://emerald.widgetbot.io",
        className: "widgetbot",
      }
    : {
        server: "960606557622657026",
        channel: "1052634176161054782",
        className: "widgetbot",
      };

const adjectives = [
  "Jolly", "Cool", "Happy", "Silly", "Brave", "Calm", "Clever", "Daring",
  "Fierce", "Gentle", "Grumpy", "Hungry", "Jumpy", "Kind", "Loud", "Quick",
  "Mellow", "Quiet", "Witty", "Agile", "Blissful", "Bold", "Charming",
  "Curious", "Dreamy", "Funny", "Golden", "Honest", "Innocent",
  "Joyful", "Keen", "Loyal", "Big", "Noble", "Peaceful", "Playful",
  "Radiant", "Serene", "Shy", "Sleepy", "Swift", "Wise", "Fast", "Slow"
];

const animals = [
  "Bird", "Duck", "Unicorn", "Bee", "Chicken", "Pig", "Sheep", "Cat", "Dog", "Turtle", "Crab",
  "Dolphin", "Fish", "Prawn", "Whale", "Dinosaur", "Elephant", "Frog", "Mouse", "Rabbit",
  "Snail"
];

const animalAvatars = {
  Bird: '/assets/img/webchat/Bird.png',
  Duck: '/assets/img/webchat/Duck.png',
  Unicorn: '/assets/img/webchat/Unicorn.png',
  Bee: '/assets/img/webchat/Bee.png',
  Chicken: '/assets/img/webchat/Chicken.png',
  Pig: '/assets/img/webchat/Pig.png',
  Sheep: '/assets/img/webchat/Sheep.png',
  Cat: '/assets/img/webchat/Cat.png',
  Dog: '/assets/img/webchat/Dog.png',
  Turtle: '/assets/img/webchat/Turtle.png',
  Crab: '/assets/img/webchat/Crab.png',
  Dolphin: '/assets/img/webchat/Dolphin.png',
  Fish: '/assets/img/webchat/Fish.png',
  Prawn: '/assets/img/webchat/Prawn.png',
  Whale: '/assets/img/webchat/Whale.png',
  Dinosaur: '/assets/img/webchat/Dinosaur.png',
  Elephant: '/assets/img/webchat/Elephant.png',
  Frog: '/assets/img/webchat/Frog.png',
  Mouse: '/assets/img/webchat/Mouse.png',
  Rabbit: '/assets/img/webchat/Rabbit.png',
  Snail: '/assets/img/webchat/Snail.png'
};

const readableColors = [
  "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#34495e", "#1abc9c", "#e67e22", "#95a5a6"
];

const createColoredAvatar = (imagePath, color) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      canvas.width = 128;
      canvas.height = 128;
      
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 16, 16);
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = imagePath;
  });
};

const Webchat = () => {
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const generateRandomUsername = async () => {
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      const randomNumber = Math.floor(Math.random() * 90) + 10;
      
      const newUsername = `${randomAdjective}${randomAnimal}${randomNumber}`;
      const imagePath = animalAvatars[randomAnimal] || null;
      
      const randomColor = readableColors[Math.floor(Math.random() * readableColors.length)];
      
      if (imagePath) {
        const newAvatarUrl = await createColoredAvatar(imagePath, randomColor);
        setAvatarUrl(newAvatarUrl);
      }
      
      setUsername(newUsername);
    };
    
    generateRandomUsername();
  }, []);

  if (!username) {
    return <p>Loading chat...</p>;
  }

  return (
    <WidgetBot 
      {...parameters}
      username={username}
      avatar={avatarUrl}
    />
  );
};

export default Webchat;