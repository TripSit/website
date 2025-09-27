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
  Bird: 'https://i.gyazo.com/656747aa72337965d0d1e2aa6b866d5f.png',
  Duck: 'https://i.gyazo.com/df45ad056b846fc3e418ad57f51487e7.png',
  Unicorn: 'https://i.gyazo.com/9a35ab64526d61c4ecc284857cd1102c.png',
  Bee: 'https://i.gyazo.com/c5f2dc45282b693902fd4c52da77272d.png',
  Chicken: 'https://i.gyazo.com/a1d75a56999593c050231f4bbbfa3f25.png',
  Pig: 'https://i.gyazo.com/da9b3a32219f21e4ddf8658681e002ac.png',
  Sheep: 'https://i.gyazo.com/9f994fe630929949daaec6bad176245c.png',
  Cat: 'https://i.gyazo.com/d08c3a910e7d63322765d35a72eeb893.png',
  Dog: 'https://i.gyazo.com/d3190c498fa67d08dbcc60cc8b5f0e3f.png',
  Turtle: 'https://i.gyazo.com/640bd24ab12c9ac41a35b687716202f4.png',
  Crab: 'https://i.gyazo.com/36b6b473cf7c2b391c5484c76c8a309a.png',
  Dolphin: 'https://i.gyazo.com/aa080d42ba85a3a6ceda4b0bd13e4f33.png',
  Fish: 'https://i.gyazo.com/68b4af977eec8289e0159a1751b325ab.png',
  Prawn: 'https://i.gyazo.com/35bc2b0bc859b0b6dec2ca6bbdf60b54.png',
  Whale: 'https://i.gyazo.com/8f93943a5d908b595d2219f9fc57c06b.png',
  Dinosaur: 'https://i.gyazo.com/08e6b9470b82f3cac5f586a3eb1942c2.png',
  Elephant: 'https://i.gyazo.com/a066c2ea321da4b135ca763aeb1b4995.png',
  Frog: 'https://i.gyazo.com/e6153ae5dbf5bf42e5920f7cd5d7caba.png',
  Mouse: 'https://i.gyazo.com/a65d9e6bfcba9ad0b7b4ef6534bd3212.png',
  Rabbit: 'https://i.gyazo.com/569b37dcb0e34f40c2a9aaba789095d1.png',
  Snail: 'https://i.gyazo.com/146ba8288759e4e763bfc7f9d1069283.png'
};

const Webchat = () => {
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const generateRandomUsername = () => {
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      const randomNumber = Math.floor(Math.random() * 90) + 10;
      
      const newUsername = `${randomAdjective}${randomAnimal}${randomNumber}`;
      const newAvatarUrl = animalAvatars[randomAnimal] || null;
      
      setUsername(newUsername);
      setAvatarUrl(newAvatarUrl);
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