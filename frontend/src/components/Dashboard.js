import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Bar, Line } from "react-chartjs-2";
import LiveTrendVisualizer from "./LiveTrendVisualizer";
import LiveHeatmap from "./LiveHeatmap";
import AI_DecisionTreeVisualizer from "./DecisionTree";
import PredictiveForecastChart from "./PredictiveForecastChart";
import InteractiveGlobe from "./InteractiveGlobe";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [liveChartData, setLiveChartData] = useState({ labels: [], data: [] });
  const [quote, setQuote] = useState("");
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null); // Track which habit is selected
  const [selectedHabitDescription, setSelectedHabitDescription] = useState(""); // Store habit description
  const [educationResources, setEducationResources] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          console.warn("Token expired, redirecting to login");
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        await Promise.allSettled([
          fetchDashboardData(token),
          fetchChartData(token),
          fetchQuote(),
          fetchHabits(),
          fetchEducationResources(),
        ]);

        setLoading(false); 
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading data. Please try again later.");
        setLoading(false); 
      }
    };

    fetchAllData();

    const interval = setInterval(() => {
      updateLiveChartData();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setUserData({ username: "Guest", email: "guest@example.com" }); // Fallback demo data
    }
  };

  const fetchChartData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chart-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChartData(response.data || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartData([]);
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await axios.get("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
      const parsedResponse = JSON.parse(response.data.contents);
      const quoteText = parsedResponse[0]?.q + " - " + parsedResponse[0]?.a;
      setQuote(quoteText);
    } catch (err) {
      console.error("Error fetching motivational quote:", err);
      setQuote("Stay motivated to achieve your goals!");
    }
  };

  const fetchHabits = () => {
    const habitList = [
      "Exercise daily", "Read 20 minutes", "Write a journal", "Practice mindfulness",
      "Learn a new skill", "Drink more water", "Declutter one area", "Plan tomorrow's tasks",
      "Practice gratitude", "Stretch for 10 minutes", "Limit screen time", "Go for a walk",
      "Meditate for 5 minutes", "Write a to-do list", "Call a friend or family member",
      "Learn a new word", "Cook a healthy meal", "Practice deep breathing",
      "Spend time in nature", "Reflect on your day", "Limit caffeine intake",
      "Read a motivational quote", "Track your expenses", "Organize your workspace",
      "Take a power nap", "Smile at a stranger", "Do 15 minutes of cardio",
      "Write down a goal", "Compliment someone", "Focus on a single task",
      "Avoid procrastination", "Limit social media", "Journal about gratitude",
      "Set a new habit", "Break a bad habit", "Watch an educational video",
      "Learn a hobby", "Spend time with loved ones", "Volunteer for a cause",
      "Reflect on your strengths", "Set a daily affirmation",
      "Do a random act of kindness", "Focus on posture", "Set a digital detox day",
      "Drink herbal tea", "Write about your dreams", "Spend time with a pet",
      "Work on a personal project", "Learn a new recipe", "Organize your closet",
      "Write a letter to your future self", "Plan your meals for the week",
      "Research something you're curious about", "Create a vision board",
      "Do yoga for 15 minutes", "Write a poem", "Learn basic self-defense",
      "Reduce sugar intake", "Take a tech-free hour", "Focus on active listening",
      "Practice self-compassion", "Learn a new language phrase",
      "Create a budget", "Spend time gardening", "Do a puzzle", 
      "Plan a weekend adventure", "Create a gratitude jar",
      "Try a new workout", "Make a playlist of your favorite songs",
      "Declutter your email inbox", "Send a thank-you note", "Take a cold shower",
      "Do an online course", "Practice a musical instrument", "Start a creative project",
      "Explore a local park", "Create a personal mantra", "Learn a magic trick",
      "Take photos of nature", "Try a new type of cuisine", "Experiment with meditation techniques",
      "Read a book on personal development", "Volunteer at an animal shelter",
      "Have a picnic outdoors", "Plan a day to focus on self-care",
      "Write down your bucket list", "Read a biography", "Listen to a podcast",
      "Visit a local museum", "Paint or draw something", "Try a DIY project",
      "Practice public speaking", "Start a blog or journal online",
      "Track your sleep patterns", "Learn about a historical event",
      "Try a breathing exercise", "Donate items you no longer need",
      "Learn about a new culture", "Practice smiling more often",
      "Research a hobby you're interested in", "Read a book from a new genre",
      "Spend time stargazing", "Try a new sport", "Have a screen-free meal",
      "Write about what makes you happy", "Plan a surprise for someone",
      "Make your bed every morning", "Try a sound bath meditation",
      "Write a short story", "Do a random act of kindness for a stranger",
      "Create a healthy smoothie", "Spend time learning photography",
      "Review your goals weekly", "Write a list of things you're thankful for",
      "Spend time with a mentor", "Learn about minimalism",
      "Reflect on your accomplishments", "Try a stretching routine",
      "Organize your computer files", "Visit a farmer's market",
      "Create a self-improvement checklist", "Learn about mindfulness eating",
      "Start a workout challenge", "Reconnect with an old friend",
      "Try a new haircare routine", "Make a list of positive affirmations",
      "Learn to cook a dish from another country", "Have a day of gratitude journaling",
      "Try journaling prompts", "Host a game night", "Have a movie night with friends",
      "Practice speed reading", "Take a scenic drive", "Write down your dreams",
      "Track your habits daily", "Do a random outdoor activity",
      "Research new books to read", "Visit a nearby town",
      "Clean your phone screen", "Write a letter to a loved one",
      "Declutter your bookshelf", "Plan a budget-friendly vacation",
      "Learn about sustainable living", "Try to memorize a poem",
      "Make a scrapbook", "Spend time birdwatching", "Create a fitness journal",
      "Try aromatherapy", "Spend time painting rocks",
      "Watch a documentary", "Make a daily to-do list", "Try intermittent fasting",
      "Learn origami", "Practice handwriting", "Write a thank-you note",
      "Plant a tree", "Create a skincare routine", "Organize your pantry",
      "Learn a programming language", "Explore an art gallery", "Take part in a charity event",
      "Do a gratitude meditation", "Focus on reducing waste", "Try a new workout class",
      "Write down your priorities", "Make a vision board", "Create a dream journal",
      "Spend time with a senior citizen", "Learn a board game", "Reflect on a life lesson",
      "Write about your favorite memories", "Set new monthly goals", "Do an act of charity",
      "Try a morning routine reset", "Learn to budget effectively",
      "Organize your workout gear", "Read an inspiring book", "Learn about your family history",
      "Reflect on your strengths and weaknesses", "Try a social media detox",
      "Read a motivational article", "Take a new path for your daily walk",
      "Learn about a famous inventor", "Cook a meal from scratch",
      "Explore a new walking route", "Try out journaling for mental health",
      "Start a fitness log", "Create a gallery wall", "Watch the sunrise",
      "Watch the sunset", "Clean your desk", "Write a positive note to yourself",
      "Spend 5 minutes in silent reflection", "Organize your wardrobe",
      "Host a virtual meet-up", "Learn about personal productivity",
      "Create a meal-prep plan", "Start an indoor herb garden",
      "Learn about your local history", "Watch an inspiring TED Talk",
      "Try digital art", "Create a new exercise playlist", "Try meal prepping for the week",
      "Spend an hour tech-free", "Read an inspirational biography",
      "Learn about the stars", "Create a new morning habit",
      "Have a daily reflection session", "Do a simple science experiment",
      "Learn about financial literacy", "Declutter your digital devices",
      "Find a new motivational quote daily", "Take a 30-minute nature walk",
      "Write down your travel bucket list", "Donate to a cause",
      "Try a creative writing exercise", "Spend time in deep breathing exercises",
      "Plan your next week's meals", "Set weekly intentions",
      "Try a creative hobby", "Bake a dessert from scratch",
      "Make a plan to stay hydrated", "Do something kind for a loved one"
    ];

    const generateHabits = () => {
      const shuffledHabits = habitList.sort(() => 0.5 - Math.random());
      setHabits(shuffledHabits.slice(0, 3));
    };

    generateHabits();
  };

  const habitDescriptions = {
    "Exercise daily": "Improve your physical health and energy levels by exercising daily.",
    "Read 20 minutes": "Expand your knowledge and vocabulary by reading every day.",
    "Write a journal": "Reflect on your thoughts and experiences by keeping a daily journal.",
    "Practice mindfulness": "Cultivate awareness and reduce stress through mindfulness practices.",
    "Learn a new skill": "Develop yourself by learning something new and exciting.",
    "Drink more water": "Stay hydrated to maintain your overall health and energy.",
    "Declutter one area": "Organize your space and clear your mind by decluttering daily.",
    "Plan tomorrow's tasks": "Stay organized and productive by planning your tasks in advance.",
    "Practice gratitude": "Improve your mood and mindset by focusing on things you are grateful for.",
    "Stretch for 10 minutes": "Increase your flexibility and relieve tension with a daily stretch.",
    "Limit screen time": "Protect your eyes and mental health by reducing screen usage.",
    "Go for a walk": "Boost your physical and mental health with a relaxing walk.",
    "Meditate for 5 minutes": "Calm your mind and reduce stress with a short meditation session.",
    "Write a to-do list": "Organize your day and achieve your goals by creating a to-do list.",
    "Call a friend or family member": "Strengthen relationships by connecting with loved ones.",
    "Learn a new word": "Expand your vocabulary by learning a new word every day.",
    "Cook a healthy meal": "Take control of your diet by preparing a nutritious meal.",
    "Practice deep breathing": "Relieve stress and improve focus with deep breathing exercises.",
    "Spend time in nature": "Recharge and gain clarity by spending time outdoors.",
    "Reflect on your day": "Analyze your achievements and challenges by reflecting daily.",
    "Limit caffeine intake": "Improve your sleep and reduce anxiety by moderating caffeine consumption.",
    "Read a motivational quote": "Stay inspired and motivated by reading uplifting quotes.",
    "Track your expenses": "Take control of your finances by monitoring your spending habits.",
    "Organize your workspace": "Increase productivity by keeping your workspace tidy.",
    "Take a power nap": "Boost your energy and focus with a short nap during the day.",
    "Smile at a stranger": "Spread positivity and kindness with a simple smile.",
    "Do 15 minutes of cardio": "Enhance your cardiovascular health with quick daily exercise.",
    "Write down a goal": "Clarify your aspirations and track progress by setting a goal.",
    "Compliment someone": "Brighten someone's day and foster positivity with a genuine compliment.",
    "Focus on a single task": "Increase productivity by concentrating on one task at a time.",
    "Avoid procrastination": "Achieve your goals faster by staying disciplined and proactive.",
    "Limit social media": "Protect your mental health by spending less time on social media.",
    "Journal about gratitude": "Develop a positive mindset by writing about things you are thankful for.",
    "Set a new habit": "Take a step toward self-improvement by establishing a new habit.",
    "Break a bad habit": "Improve your life by identifying and stopping an unhelpful habit.",
    "Watch an educational video": "Learn something new by watching an informative video.",
    "Learn a hobby": "Add joy to your life by picking up a fun and creative hobby.",
    "Spend time with loved ones": "Strengthen bonds by sharing quality time with those who matter.",
    "Volunteer for a cause": "Make a difference by giving your time to a meaningful cause.",
    "Reflect on your strengths": "Build confidence by acknowledging your abilities and achievements.",
    "Set a daily affirmation": "Encourage positivity with empowering statements each day.",
    "Do a random act of kindness": "Brighten someone's day with an unexpected kind gesture.",
    "Focus on posture": "Prevent discomfort and boost confidence by improving your posture.",
    "Set a digital detox day": "Recharge by spending a day away from electronic devices.",
    "Drink herbal tea": "Relax and unwind with a calming cup of herbal tea.",
    "Write about your dreams": "Gain insights and inspire creativity by journaling your dreams.",
    "Spend time with a pet": "Enjoy companionship and reduce stress by spending time with a pet.",
    "Work on a personal project": "Pursue your passion by dedicating time to a personal project.",
    "Learn a new recipe": "Expand your culinary skills by trying out a new recipe.",
    "Organize your closet": "Maintain a tidy environment by sorting and arranging your clothes, reducing stress and saving time.",
    "Write a letter to your future self": "Reflect on your current goals and dreams, offering guidance and encouragement to the person you’ll become.",
    "Plan your meals for the week": "Save time, reduce stress, and ensure balanced eating by organizing your weekly menu in advance.",
    "Research something you're curious about": "Satisfy your curiosity and broaden your horizons by exploring a topic that piques your interest.",
    "Create a vision board": "Visualize your aspirations by crafting a collage of images and quotes that inspire your personal goals.",
    "Do yoga for 15 minutes": "Enhance flexibility, reduce tension, and gain mental clarity with a short, calming yoga session.",
    "Write a poem": "Express emotions and spark creativity by putting words into poetic form.",
    "Learn basic self-defense": "Build confidence and personal safety by mastering fundamental self-defense techniques.",
    "Reduce sugar intake": "Support overall health and stable energy levels by cutting back on sugary foods and drinks.",
    "Take a tech-free hour": "Unplug to rejuvenate your mind, be more present, and appreciate life offline.",
    "Focus on active listening": "Improve communication and relationships by fully engaging in what others say.",
    "Practice self-compassion": "Be kinder to yourself, acknowledge mistakes without judgment, and nurture emotional well-being.",
    "Learn a new language phrase": "Expand your cultural and linguistic horizons by mastering a useful phrase in another language.",
    "Create a budget": "Gain financial stability by outlining your income, expenses, and savings goals.",
    "Spend time gardening": "Reduce stress, connect with nature, and enjoy the rewards of nurturing plant life.",
    "Do a puzzle": "Sharpen your problem-solving skills and relax by piecing together a puzzle.",
    "Plan a weekend adventure": "Break from routine and create memorable experiences by scheduling a short trip or activity.",
    "Create a gratitude jar": "Foster positivity by writing down things you're thankful for and revisiting them later.",
    "Try a new workout": "Keep fitness fun and engaging by exploring different exercises and routines.",
    "Make a playlist of your favorite songs": "Boost your mood and energy by curating music that resonates with you.",
    "Declutter your email inbox": "Streamline your digital life by sorting, archiving, or deleting unnecessary emails.",
    "Send a thank-you note": "Strengthen connections and spread kindness by expressing genuine gratitude to someone.",
    "Take a cold shower": "Invigorate your body and mind, improve circulation, and build resilience with a brisk cold rinse.",
    "Do an online course": "Expand your knowledge and skills by learning remotely on a subject that interests you.",
    "Practice a musical instrument": "Enhance coordination, patience, and creativity by playing an instrument regularly.",
    "Start a creative project": "Unleash your imagination by beginning an art, craft, or writing endeavor.",
    "Explore a local park": "Enjoy fresh air, natural beauty, and gentle exercise by visiting nearby green spaces.",
    "Create a personal mantra": "Foster self-confidence and focus by repeating a short, meaningful phrase to yourself.",
    "Learn a magic trick": "Delight others and train your mind by mastering a simple illusion or card trick.",
    "Take photos of nature": "Appreciate beauty, sharpen observation skills, and capture inspiring outdoor scenes.",
    "Try a new type of cuisine": "Expand your taste buds and cultural understanding by sampling dishes from different regions.",
    "Experiment with meditation techniques": "Deepen your mindfulness by trying various meditation styles, from guided imagery to breathing exercises.",
    "Read a book on personal development": "Gain insights on growth, success, and self-improvement by exploring helpful literature.",
    "Volunteer at an animal shelter": "Show compassion and help animals in need, strengthening empathy and kindness.",
    "Have a picnic outdoors": "Combine relaxation, nature, and good food by dining alfresco in a scenic spot.",
    "Plan a day to focus on self-care": "Recharge mentally and physically by dedicating a day to activities that nourish your well-being.",
    "Write down your bucket list": "Clarify your long-term aspirations and motivate yourself to pursue meaningful adventures.",
    "Read a biography": "Draw inspiration and wisdom from the life stories and challenges overcome by notable individuals.",
    "Listen to a podcast": "Stay informed, entertained, or inspired by tuning into discussions on topics you enjoy.",
    "Visit a local museum": "Expand your knowledge and appreciation of art, history, or science by exploring exhibits nearby.",
    "Paint or draw something": "Channel creativity and reduce stress by putting pencil or brush to paper.",
    "Try a DIY project": "Boost confidence and learn new skills by working on a hands-on creative or home-improvement project.",
    "Practice public speaking": "Build confidence, clarity, and persuasion skills by speaking in front of others.",
    "Start a blog or journal online": "Share your thoughts, ideas, or expertise while honing your writing and storytelling abilities.",
    "Track your sleep patterns": "Improve rest and energy by monitoring how well you sleep and adjusting habits accordingly.",
    "Learn about a historical event": "Deepen your understanding of the world by studying a significant past occurrence.",
    "Try a breathing exercise": "Calm your mind and reduce stress through structured, mindful breathing.",
    "Donate items you no longer need": "Help others and create space for yourself by giving away goods to those in need.",
    "Learn about a new culture": "Broaden your perspective and foster empathy by exploring traditions, languages, and customs different from your own.",
    "Practice smiling more often": "Elevate your mood and positively influence those around you by smiling frequently.",
    "Research a hobby you're interested in": "Turn curiosity into action by exploring how to get started with a pastime you've always wanted to try.",
    "Read a book from a new genre": "Challenge your reading habits and discover new worlds by venturing into unfamiliar literary territory.",
    "Spend time stargazing": "Find peace and wonder in the night sky, observing constellations and distant planets.",
    "Try a new sport": "Stay active, develop new skills, and meet people by participating in a sport you haven't tried before.",
    "Have a screen-free meal": "Enhance mindfulness and connection by eating without digital distractions.",
    "Write about what makes you happy": "Identify sources of joy and gratitude by reflecting on the positive elements in your life.",
    "Plan a surprise for someone": "Show care and creativity by organizing an unexpected treat or event for a loved one.",
    "Make your bed every morning": "Start the day with a small accomplishment, setting a tone of order and productivity.",
    "Try a sound bath meditation": "Relax deeply and soothe tension by immersing yourself in calming, resonant sounds.",
    "Write a short story": "Cultivate imagination and narrative skills by crafting a brief, engaging tale.",
    "Do a random act of kindness for a stranger": "Spread kindness in your community by offering help, comfort, or generosity without expectation.",
    "Create a healthy smoothie": "Fuel your body with essential nutrients by blending fruits, vegetables, and other wholesome ingredients.",
    "Spend time learning photography": "Develop an artistic eye, composition skills, and technical know-how by practicing camera work.",
    "Review your goals weekly": "Stay accountable and aligned with your aspirations by regularly evaluating your progress.",
    "Write a list of things you're thankful for": "Foster positivity by enumerating people, experiences, and comforts you appreciate.",
    "Spend time with a mentor": "Gain wisdom, guidance, and motivation by seeking insights from someone more experienced.",
    "Learn about minimalism": "Simplify life, reduce clutter, and find fulfillment in essentials by understanding minimalist principles.",
    "Reflect on your accomplishments": "Boost self-esteem and motivation by acknowledging what you've achieved and learned.",
    "Try a stretching routine": "Improve flexibility and release tension by performing regular stretches.",
    "Organize your computer files": "Increase efficiency and reduce digital stress by sorting your documents and media.",
    "Visit a farmer's market": "Support local businesses, enjoy fresh produce, and discover new flavors in your community.",
    "Create a self-improvement checklist": "Set clear targets for personal growth by outlining specific actions to enhance your life.",
    "Learn about mindfulness eating": "Improve digestion and enjoyment by eating slowly, savoring flavors, and paying attention to hunger cues.",
    "Start a workout challenge": "Increase motivation and track progress by committing to a fitness regimen for a set period.",
    "Reconnect with an old friend": "Strengthen social bonds and revisit happy memories by reaching out to someone from your past.",
    "Try a new haircare routine": "Keep your hair healthy and vibrant by experimenting with different products or techniques.",
    "Make a list of positive affirmations": "Build self-confidence by writing encouraging statements that reinforce your worth.",
    "Learn to cook a dish from another country": "Expand your culinary horizons and cultural understanding by preparing international cuisine.",
    "Have a day of gratitude journaling": "Immerse yourself in thankfulness by dedicating a full day to noting what you appreciate.",
    "Try journaling prompts": "Spark self-discovery by using guided questions or ideas to inspire your writing.",
    "Host a game night": "Foster fun and connection by inviting friends or family over to play board or card games.",
    "Have a movie night with friends": "Relax and bond over storytelling by watching films or shows together.",
    "Practice speed reading": "Improve comprehension and productivity by learning techniques to read faster.",
    "Take a scenic drive": "Refresh your mind by exploring new roads, enjoying views, and listening to favorite tunes.",
    "Write down your dreams": "Document nighttime visions to find patterns, inspiration, or just entertain your imagination.",
    "Track your habits daily": "Increase accountability and identify progress by monitoring your daily routines.",
    "Do a random outdoor activity": "Embrace spontaneity and fresh air by trying something new outside, like a short hike or picnic.",
    "Research new books to read": "Expand literary horizons by looking up recommendations and bestsellers for future reading.",
    "Visit a nearby town": "Discover local culture and hidden gems by taking a short trip to a place close to home.",
    "Clean your phone screen": "Improve hygiene and clarity by wiping away fingerprints, dust, and germs.",
    "Write a letter to a loved one": "Express admiration, gratitude, or affection by putting heartfelt words on paper.",
    "Declutter your bookshelf": "Create space for new learning by sorting through books you no longer need.",
    "Plan a budget-friendly vacation": "Travel without financial strain by researching affordable destinations and deals.",
    "Learn about sustainable living": "Reduce your environmental footprint by adopting eco-friendly habits and resourcefulness.",
    "Try to memorize a poem": "Challenge your memory and appreciate language by committing verses to heart.",
    "Make a scrapbook": "Cherish memories by compiling photos, notes, and mementos into a personal keepsake.",
    "Spend time birdwatching": "Enjoy nature and build patience by observing local bird species in their natural habitats.",
    "Create a fitness journal": "Record workouts, track progress, and set goals to stay motivated on your fitness journey.",
    "Try aromatherapy": "Enhance your mood and relaxation with calming scents from essential oils or candles.",
    "Spend time painting rocks": "Combine creativity and nature by decorating stones and placing them in meaningful locations.",
    "Watch a documentary": "Expand your knowledge and perspective on real-world topics through informative storytelling.",
    "Make a daily to-do list": "Increase productivity and reduce stress by outlining tasks for the day.",
    "Try intermittent fasting": "Experiment with structured eating periods that may support metabolism and overall health.",
    "Learn origami": "Improve dexterity and focus by folding paper into intricate shapes and designs.",
    "Practice handwriting": "Enhance penmanship, mindfulness, and fine motor skills by writing neatly by hand.",
    "Write a thank-you note": "Show appreciation and acknowledge kindness through a heartfelt message.",
    "Plant a tree": "Support the environment, provide habitat for wildlife, and beautify your surroundings.",
    "Create a skincare routine": "Improve skin health and appearance by consistently cleansing, moisturizing, and protecting.",
    "Organize your pantry": "Streamline cooking and reduce waste by sorting and labeling pantry items.",
    "Learn a programming language": "Boost logic, problem-solving, and creativity by studying code.",
    "Explore an art gallery": "Inspire imagination and cultural appreciation by viewing diverse artworks.",
    "Take part in a charity event": "Give back to the community and find purpose through volunteer work or fundraising.",
    "Do a gratitude meditation": "Center your thoughts on thankfulness, improving your outlook and resilience.",
    "Focus on reducing waste": "Adopt eco-friendly practices like recycling, reusing, and composting to protect the planet.",
    "Try a new workout class": "Keep exercise exciting by sampling different fitness sessions or groups.",
    "Write down your priorities": "Clarify what matters most and guide your daily decisions accordingly.",
    "Make a vision board": "Craft a visual guide to your dreams and aspirations, inspiring consistent effort.",
    "Create a dream journal": "Record and interpret your dreams regularly, uncovering insights and patterns.",
    "Spend time with a senior citizen": "Learn from older generations, share stories, and foster intergenerational understanding.",
    "Learn a board game": "Improve strategic thinking and have fun by mastering a new game’s rules.",
    "Reflect on a life lesson": "Grow wiser by revisiting a past experience and understanding its message.",
    "Write about your favorite memories": "Boost happiness by recalling and detailing cherished personal moments.",
    "Set new monthly goals": "Stay motivated by establishing and reviewing achievable objectives each month.",
    "Do an act of charity": "Make a positive impact by supporting a cause or helping someone in need.",
    "Try a morning routine reset": "Refresh your day’s start by adding, removing, or adjusting habits for more energy and focus.",
    "Learn to budget effectively": "Improve financial health by tracking expenses, saving money, and avoiding unnecessary spending.",
    "Organize your workout gear": "Simplify exercise sessions by neatly arranging clothes and equipment.",
    "Read an inspiring book": "Spark motivation and fresh ideas by choosing literature that encourages personal growth.",
    "Learn about your family history": "Connect with your heritage by researching ancestors, traditions, and stories.",
    "Reflect on your strengths and weaknesses": "Increase self-awareness by acknowledging areas of proficiency and room for improvement.",
    "Try a social media detox": "Reclaim time and mental clarity by taking a break from online platforms.",
    "Read a motivational article": "Find encouragement and new perspectives in uplifting written content.",
    "Take a new path for your daily walk": "Break monotony and discover new sights by altering your usual route.",
    "Learn about a famous inventor": "Draw inspiration from innovators by studying their breakthroughs and perseverance.",
    "Cook a meal from scratch": "Appreciate fresh ingredients and hone culinary skills by preparing a dish entirely by hand.",
    "Explore a new walking route": "Embrace variety and curiosity by wandering along unfamiliar streets or trails.",
    "Try out journaling for mental health": "Process emotions and reduce stress by regularly writing down your thoughts.",
    "Start a fitness log": "Monitor workouts, track progress, and make informed changes to your exercise routine.",
    "Create a gallery wall": "Personalize your space by arranging art or photos that reflect your style and achievements.",
    "Watch the sunrise": "Begin your day inspired and calm by observing the morning sky’s changing hues.",
    "Watch the sunset": "Unwind and find gratitude in nature’s daily finale of color and light.",
    "Clean your desk": "Boost focus and productivity by maintaining a clutter-free, organized workspace.",
    "Write a positive note to yourself": "Encourage self-confidence and motivation by penning kind words addressed to you.",
    "Spend 5 minutes in silent reflection": "Clear mental clutter and regain composure by pausing in quiet contemplation.",
    "Organize your wardrobe": "Streamline dressing and reduce decision fatigue by sorting clothes and accessories.",
    "Host a virtual meet-up": "Stay connected with distant friends or colleagues by gathering online for conversation or activities.",
    "Learn about personal productivity": "Optimize your time and output by studying methods that improve efficiency.",
    "Create a meal-prep plan": "Ensure healthier eating and time savings by preparing multiple meals in advance.",
    "Start an indoor herb garden": "Add freshness to your cooking and home by growing herbs inside.",
    "Learn about your local history": "Foster community pride and understanding by exploring historical events and landmarks nearby.",
    "Watch an inspiring TED Talk": "Gain knowledge and motivation by learning from experts sharing innovative ideas.",
    "Try digital art": "Express your creativity digitally, experimenting with tools and styles on a screen.",
    "Create a new exercise playlist": "Enhance workouts with music that energizes and keeps you moving.",
    "Try meal prepping for the week": "Streamline your busy days by cooking and portioning healthy meals ahead of time.",
    "Spend an hour tech-free": "Recharge mentally by engaging in hobbies, reading, or conversation without devices.",
    "Read an inspirational biography": "Learn from the resilience and determination of someone who overcame challenges.",
    "Learn about the stars": "Discover astronomy, constellations, and celestial wonders to deepen your sense of wonder.",
    "Create a new morning habit": "Improve your start of the day by adding an activity that fuels productivity or well-being.",
    "Have a daily reflection session": "Gain insight and direction by reviewing your actions, achievements, and lessons each evening.",
    "Do a simple science experiment": "Spark curiosity and hands-on learning by testing a basic scientific principle.",
    "Learn about financial literacy": "Build confidence in managing money, saving, investing, and planning for the future.",
    "Declutter your digital devices": "Enhance efficiency by removing unused apps, organizing files, and streamlining notifications.",
    "Find a new motivational quote daily": "Inspire yourself every morning by seeking a phrase that sets a positive tone.",
    "Take a 30-minute nature walk": "Refresh your mind and body by strolling outdoors amid greenery and fresh air.",
    "Write down your travel bucket list": "Fuel wanderlust by listing destinations and adventures you hope to experience.",
    "Donate to a cause": "Support meaningful work and make a positive difference by contributing funds or goods.",
    "Try a creative writing exercise": "Stimulate your imagination by tackling prompts or story starters that challenge your creativity.",
    "Spend time in deep breathing exercises": "Calm nerves, refocus, and rejuvenate your mind with intentional breathing practices.",
    "Plan your next week's meals": "Reduce daily decisions and ensure balanced nutrition by outlining menus in advance.",
    "Set weekly intentions": "Guide your actions and mindset by choosing a focus or aim for each new week.",
    "Try a creative hobby": "Nurture your imagination and unwind by exploring activities like painting or crafting.",
    "Bake a dessert from scratch": "Enhance culinary confidence and treat yourself by preparing a sweet dish with your own hands.",
    "Make a plan to stay hydrated": "Improve health and skin by setting daily water intake goals and reminders.",
    "Do something kind for a loved one": "Strengthen bonds and spread positivity by offering help, gifts, or words of support to someone you care about."
  };

  // When a habit is clicked, show details in a modal
  const handleHabitClick = (habit) => {
    const description = habitDescriptions[habit] || "Details not available.";
    setSelectedHabit(habit);
    setSelectedHabitDescription(description);
  };

  const closeHabitModal = () => {
    setSelectedHabit(null);
    setSelectedHabitDescription("");
  };

  const fetchEducationResources = async () => {
    try {
      setEducationResources([
        { name: "freeCodeCamp", link: "https://www.freecodecamp.org/", category: "Programming & Web Development" },
        { name: "MDN Web Docs", link: "https://developer.mozilla.org/", category: "Programming & Web Development" },
        { name: "W3Schools", link: "https://www.w3schools.com/", category: "Programming & Web Development" },
        { name: "GeeksforGeeks", link: "https://www.geeksforgeeks.org/", category: "Programming & Web Development" },
        { name: "Codecademy", link: "https://www.codecademy.com/", category: "Programming & Web Development" },
        { name: "The Odin Project", link: "https://www.theodinproject.com/", category: "Programming & Web Development" },

        { name: "Kaggle Learn", link: "https://www.kaggle.com/learn", category: "Data Science & Machine Learning" },
        { name: "Fast.ai", link: "https://www.fast.ai/", category: "Data Science & Machine Learning" },
        { name: "DataCamp", link: "https://www.datacamp.com/", category: "Data Science & Machine Learning" },
        { name: "Coursera - Machine Learning by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning", category: "Data Science & Machine Learning" },

        { name: "Interaction Design Foundation", link: "https://www.interaction-design.org/", category: "UI/UX & Design" },
        { name: "Figma Learn", link: "https://www.figma.com/resources/learn-design/", category: "UI/UX & Design" },
        { name: "Adobe XD Ideas", link: "https://xd.adobe.com/ideas/", category: "UI/UX & Design" },
        { name: "Canva Design School", link: "https://www.canva.com/learn/", category: "UI/UX & Design" },

        { name: "Khan Academy (Math & Science)", link: "https://www.khanacademy.org/science", category: "Mathematics & Sciences" },
        { name: "MIT OpenCourseWare", link: "https://ocw.mit.edu/", category: "Mathematics & Sciences" },
        { name: "Brilliant", link: "https://www.brilliant.org/", category: "Mathematics & Sciences" },
        { name: "Wolfram MathWorld", link: "https://mathworld.wolfram.com/", category: "Mathematics & Sciences" },

        { name: "Duolingo", link: "https://www.duolingo.com/", category: "Language Learning" },
        { name: "Babbel", link: "https://www.babbel.com/", category: "Language Learning" },
        { name: "LingQ", link: "https://www.lingq.com/", category: "Language Learning" },
        { name: "italki", link: "https://www.italki.com/", category: "Language Learning" },

        { name: "edX Business Courses", link: "https://www.edx.org/learn/business", category: "Business & Finance" },
        { name: "Coursera Business Specializations", link: "https://www.coursera.org/browse/business", category: "Business & Finance" },
        { name: "HubSpot Academy", link: "https://academy.hubspot.com/", category: "Business & Finance" },
        { name: "Futureskilling (Udemy)", link: "https://www.udemy.com/topic/business/", category: "Business & Finance" },

        { name: "Skillshare", link: "https://www.skillshare.com/", category: "Creative Skills" },
        { name: "Domestika", link: "https://www.domestika.org/", category: "Creative Skills" },
        { name: "MasterClass", link: "https://www.masterclass.com/", category: "Creative Skills" },
        { name: "LinkedIn Learning (Creative Section)", link: "https://www.linkedin.com/learning/", category: "Creative Skills" },

        { name: "Khan Academy (General)", link: "https://www.khanacademy.org/", category: "General Education & MOOCs" },
        { name: "Coursera", link: "https://www.coursera.org/", category: "General Education & MOOCs" },
        { name: "edX", link: "https://www.edx.org/", category: "General Education & MOOCs" },
        { name: "FutureLearn", link: "https://www.futurelearn.com/", category: "General Education & MOOCs" },
        { name: "OpenLearn (Open University)", link: "https://www.open.edu/openlearn/", category: "General Education & MOOCs" },

        { name: "Google Digital Garage", link: "https://digitalgarage.withgoogle.com/", category: "Career Development & Professional Skills" },
        { name: "Alison", link: "https://alison.com/", category: "Career Development & Professional Skills" },
        { name: "Udemy Professional Skills Courses", link: "https://www.udemy.com/", category: "Career Development & Professional Skills" },
        { name: "CareerFoundry", link: "https://careerfoundry.com/", category: "Career Development & Professional Skills" }
      ]);
    } catch (err) {
      console.error("Error fetching education resources:", err);
      setEducationResources([]);
    }
  };

  const updateLiveChartData = () => {
    setLiveChartData((prevState) => {
      const now = new Date();
      const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const newData = [...prevState.data, Math.random() * 100];
      const newLabels = [...prevState.labels, timeLabel];

      if (newData.length > 10) {
        newData.shift();
        newLabels.shift();
      }

      return { labels: newLabels, data: newData };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const generatePlaceholderChartData = () => ({
    labels: ["Skill 1", "Skill 2", "Skill 3"],
    datasets: [
      {
        label: "Progress",
        data: [0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Group education resources by category
  const categories = educationResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {userData && (
        <div className="card">
          <h2>Welcome, {userData.username}</h2>
          <p>Your email: {userData.email}</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="quote-container">
        <h2>Motivational Quote</h2>
        <p>{quote}</p>
      </div>

      {/* Habit Ideas Section */}
      <div className="habit-container">
        <h2>Habit Ideas</h2>
        <ul>
          {habits.map((habit, index) => (
            <li key={index} onClick={() => handleHabitClick(habit)}>
              {habit}
            </li>
          ))}
        </ul>
        <button onClick={fetchHabits}>Generate More Habits</button>
      </div>

      {/* Habit Details Modal */}
      {selectedHabit && (
        <>
          <div className="habit-modal-overlay active" onClick={closeHabitModal}></div>
          <div className="habit-details-modal active">
            <h2>{selectedHabit}</h2>
            <p>{selectedHabitDescription}</p>
            <button onClick={closeHabitModal}>Close</button>
          </div>
        </>
      )}

      <div className="education-container">
        <h2>Education Resources</h2>
        {Object.keys(categories).map((cat) => {
          const isExpanded = expandedCategories.includes(cat);
          return (
            <div className="education-category" key={cat}>
              <h3 onClick={() => toggleCategory(cat)}>{cat}</h3>
              {isExpanded && (
                <ul>
                  {categories[cat].map((resource, index) => (
                    <li key={index}>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="chart-container">
        <h2>Your Progress</h2>
        {chartData.length > 0 ? (
          <Bar
            data={{
              labels: chartData.map((item) => item.name || "Unknown Skill"),
              datasets: [
                {
                  label: "Skill Progress",
                  data: chartData.map((item) => item.progress || 0),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            options={chartOptions}
          />
        ) : (
          <Bar data={generatePlaceholderChartData()} options={chartOptions} />
        )}
      </div>

      <div className="chart-container">
        <PredictiveForecastChart />
      </div>

      <div className="chart-container">
        <InteractiveGlobe />
      </div>

      <div className="chart-container">
        <LiveTrendVisualizer />
      </div>

      <div className="chart-container">
        <LiveHeatmap />
      </div>

      <div className="chart-container">
        <AI_DecisionTreeVisualizer />
      </div>

      <div className="live-chart-container">
        <h2>AI Adaptive Pulse</h2>
        <Line
          data={{
            labels: liveChartData.labels,
            datasets: [
              {
                label: "Neural Signal",
                data: liveChartData.data,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
            animation: {
              duration: 0,
            },
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Processing Intensity",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
