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
import EconomicSectorBubbleMap from "./EconomicSectorBubbleMap";
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
    "Exercise daily": "To get started: Commit to a short, 10-minute workout today (a walk or light stretching). To keep going: Gradually increase your time or intensity, track your progress, and reward yourself as you hit milestones.",
    "Read 20 minutes": "To get started: Pick a book you’re curious about and read just one chapter tonight. To keep going: Schedule a set time each day, keep a reading list, and explore new genres to stay motivated.",
    "Write a journal": "To get started: Set aside 5 minutes before bed to write whatever’s on your mind. To keep going: Make journaling a daily ritual, try using prompts, and periodically review old entries to see your growth.",
    "Practice mindfulness": "To get started: Find a quiet spot and focus on your breathing for 2 minutes. To keep going: Increase this time gradually, experiment with guided meditations, and integrate mindfulness into daily tasks.",
    "Learn a new skill": "To get started: Spend 15 minutes researching the basics of something you’ve always wanted to learn. To keep going: Set small learning goals, take online courses, and track improvements over time.",
    "Drink more water": "To get started: Fill a reusable bottle and finish it by lunchtime. To keep going: Set reminders on your phone, gradually increase your daily intake, and notice boosts in energy and focus.",
    "Declutter one area": "To get started: Choose one drawer or shelf and spend 10 minutes removing unneeded items. To keep going: Declutter a small space each week, create storage solutions, and enjoy the calm of an organized environment.",
    "Plan tomorrow's tasks": "To get started: Before bed, write down 3 tasks to tackle tomorrow morning. To keep going: Make nightly planning a habit, prioritize tasks, and reflect on what works best to improve productivity.",
    "Practice gratitude": "To get started: Write down one thing you’re grateful for today. To keep going: Increase to 3 items daily, keep a gratitude journal, and re-read entries when you need a mood lift.",
    "Stretch for 10 minutes": "To get started: Do a few simple stretches after waking up. To keep going: Add different stretches over time, schedule a daily stretch break, and track improvements in flexibility.",
    "Limit screen time": "To get started: Turn off unnecessary notifications for an hour today. To keep going: Gradually increase screen-free periods, use app timers, and find offline hobbies to fill that time.",
    "Go for a walk": "To get started: Walk around your block for 10 minutes this afternoon. To keep going: Add a few more minutes each week, explore new routes, and consider inviting a friend for accountability.",
    "Meditate for 5 minutes": "To get started: Sit quietly and focus on your breath for 5 minutes right now. To keep going: Slowly extend your session, try guided meditation apps, and note the impact on your stress levels.",
    "Write a to-do list": "To get started: List your top 3 priorities for today. To keep going: Update the list daily, check off tasks as you complete them, and learn which methods help you stay organized.",
    "Call a friend or family member": "To get started: Pick one person you’ve been meaning to call and spend 5 minutes catching up. To keep going: Schedule regular calls, keep a list of people you value, and enjoy stronger relationships.",
    "Learn a new word": "To get started: Look up one unfamiliar word and use it in a sentence today. To keep going: Learn a new word daily, note them in a vocabulary list, and review them each week.",
    "Cook a healthy meal": "To get started: Find a simple, nutritious recipe and prepare it tonight. To keep going: Plan meals in advance, try new recipes each week, and pay attention to how healthy eating makes you feel.",
    "Practice deep breathing": "To get started: Inhale slowly for 4 counts, hold for 4, exhale for 4, and repeat a few times now. To keep going: Use this technique during stressful moments, set reminders, and notice calmer moods over time.",
    "Spend time in nature": "To get started: Step outside for a short walk or sit in a park for a few minutes. To keep going: Visit different natural spots, schedule regular nature breaks, and appreciate how it lifts your mood.",
    "Reflect on your day": "To get started: Before bed, think of one positive moment and one challenge from today. To keep going: Write them down each night, look for patterns over time, and make adjustments for tomorrow.",
    "Limit caffeine intake": "To get started: Replace one caffeinated drink with water or herbal tea today. To keep going: Slowly reduce caffeine sources, track changes in your sleep, and enjoy better-rested mornings.",
    "Read a motivational quote": "To get started: Search online and pick one quote that inspires you today. To keep going: Save your favorites, revisit them when you need encouragement, and share them with friends.",
    "Track your expenses": "To get started: Jot down all the money you spend today. To keep going: Review spending weekly, set budget goals, and adjust your habits to improve financial stability.",
    "Organize your workspace": "To get started: Clear just one small area of your desk right now. To keep going: Tidy for a few minutes daily, add organizers, and notice how a neat space boosts your productivity.",
    "Take a power nap": "To get started: Lie down for a 10–20-minute nap this afternoon. To keep going: Schedule naps when you feel sluggish, track their effects on productivity, and fine-tune the timing.",
    "Smile at a stranger": "To get started: Next time you’re out, make eye contact and smile at someone passing by. To keep going: Make it a habit during errands, observe positive reactions, and spread a bit of kindness each day.",
    "Do 15 minutes of cardio": "To get started: Try a quick routine like jumping jacks or a short jog. To keep going: Add variety (biking, dancing), increase duration over time, and track improvements in energy and fitness.",
    "Write down a goal": "To get started: Identify one realistic goal and write it where you’ll see it daily. To keep going: Break it into steps, set deadlines, and celebrate small victories as you progress.",
    "Compliment someone": "To get started: Tell a coworker or friend something you appreciate about them today. To keep going: Make it a daily habit, try complimenting different people, and enjoy the positive atmosphere it creates.",
    "Focus on a single task": "To get started: Turn off distractions and work on one task for 10 uninterrupted minutes now. To keep going: Gradually increase focus time, use a timer, and note how much more you accomplish.",
    "Avoid procrastination": "To get started: Pick one task you’ve been putting off and spend 5 minutes on it now. To keep going: Break tasks into small steps, reward progress, and track how quickly you finish projects.",
    "Limit social media": "To get started: Log out of one social app for an hour today. To keep going: Gradually increase offline time, mute notifications, and replace scrolling with a productive or relaxing activity.",
    "Journal about gratitude": "To get started: Write down one thing you’re grateful for today. To keep going: Add more entries each day, review them weekly, and see how this practice boosts your overall outlook.",
    "Set a new habit": "To get started: Choose a tiny habit (like drinking a glass of water after waking) and do it today. To keep going: Add triggers or reminders, track your consistency, and celebrate when it feels natural.",
    "Break a bad habit": "To get started: Identify one habit to avoid for the rest of the day. To keep going: Replace it with a healthier activity, monitor your progress, and reward yourself for resisting old patterns.",
    "Watch an educational video": "To get started: Find a short, informative video and watch it now. To keep going: Schedule weekly learning sessions, take notes, and apply what you learn in real-life situations.",
    "Learn a hobby": "To get started: Spend 10 minutes trying a beginner tutorial related to the hobby you want to explore. To keep going: Practice regularly, set small skill goals, and track improvements over time.",
    "Spend time with loved ones": "To get started: Make a quick call or plan a short visit today. To keep going: Put regular gatherings on your calendar, try new activities together, and strengthen those relationships.",
    "Volunteer for a cause": "To get started: Sign up for one short volunteer shift or a small donation today. To keep going: Schedule regular service, explore different causes, and notice the positive impact you make.",
    "Reflect on your strengths": "To get started: Write down one skill or trait you’re proud of. To keep going: Add more over time, think of ways to use them daily, and track how leveraging them improves your life.",
    "Set a daily affirmation": "To get started: Choose one uplifting phrase and say it to yourself in the morning. To keep going: Post it where you’ll see it often, try new affirmations, and note how your self-talk improves.",
    "Do a random act of kindness": "To get started: Offer help or a kind word to someone today. To keep going: Make kindness a habit, track the positive reactions, and challenge yourself to find new ways to brighten others’ days.",
    "Focus on posture": "To get started: Sit up straight and hold that position for one minute now. To keep going: Set reminders throughout the day, do posture-strengthening exercises, and notice less tension over time.",
    "Set a digital detox day": "To get started: Pick a half-day this weekend to go screen-free. To keep going: Extend the detox time, plan fun offline activities, and enjoy the clarity that comes from disconnecting.",
    "Drink herbal tea": "To get started: Brew a cup of herbal tea this afternoon. To keep going: Explore different flavors, make tea time a calming ritual, and enjoy the relaxation it brings.",
    "Write about your dreams": "To get started: Upon waking, jot down any dream details you recall. To keep going: Keep a dream journal by your bed, record regularly, and observe patterns or inspirations they offer.",
    "Spend time with a pet": "To get started: Play with or cuddle a pet for a few minutes today. To keep going: Schedule daily pet time, try new activities together, and appreciate the stress relief pets provide.",
    "Work on a personal project": "To get started: Spend 15 minutes on a project you’ve been putting off. To keep going: Break it into steps, dedicate short sessions each week, and track your progress toward completion.",
    "Learn a new recipe": "To get started: Pick a simple recipe and cook it tonight. To keep going: Try one new dish each week, experiment with ingredients, and note which meals make you feel great.",
    "Organize your closet": "To get started: Sort through one shelf or drawer, deciding what to keep or donate. To keep going: Organize another section each week, maintain order, and enjoy easy mornings choosing outfits.",
    "Write a letter to your future self": "To get started: Spend 10 minutes writing your goals and hopes, seal it, and mark a date to open it. To keep going: Write letters periodically, compare old ones, and see how you grow over time.",
    "Plan your meals for the week": "To get started: Choose tomorrow’s dinner in advance. To keep going: Gradually plan more meals, keep a grocery list, and adjust based on what meals work best for you.",
    "Research something you're curious about": "To get started: Spend 5 minutes reading about a topic you’ve always wondered about. To keep going: Save helpful resources, set aside regular research time, and share what you learn with friends.",
    "Create a vision board": "To get started: Find a few images or quotes that represent your goals. To keep going: Add to it over time, place it where you see it daily, and update it as your aspirations evolve.",
    "Do yoga for 15 minutes": "To get started: Follow a short beginner yoga video today. To keep going: Practice a few times a week, try new poses, and track improvements in flexibility and relaxation.",
    "Write a poem": "To get started: Set a timer for 5 minutes and write freely in verse. To keep going: Write a new poem weekly, experiment with different styles, and observe how your creativity expands.",
    "Learn basic self-defense": "To get started: Watch a short tutorial on a simple self-defense move. To keep going: Practice moves regularly, consider a class, and track your growing confidence.",
    "Reduce sugar intake": "To get started: Replace one sugary snack with fruit today. To keep going: Make small changes each week, try healthier alternatives, and notice improvements in energy and mood.",
    "Take a tech-free hour": "To get started: Put your phone away for one hour tonight. To keep going: Increase the length over time, find offline hobbies, and enjoy mental clarity during these breaks.",
    "Focus on active listening": "To get started: During your next conversation, listen without interrupting and summarize their point. To keep going: Practice daily, ask follow-up questions, and notice stronger connections.",
    "Practice self-compassion": "To get started: When you feel self-critical, think of one kind thought about yourself. To keep going: Keep a self-kindness journal, recognize progress, and embrace imperfections as part of learning.",
    "Learn a new language phrase": "To get started: Choose a simple greeting in another language and say it aloud. To keep going: Learn one phrase per day, review them often, and try using them with language apps or native speakers.",
    "Create a budget": "To get started: Write down your income and main expenses today. To keep going: Refine it monthly, track spending patterns, and set savings goals to stay on track.",
    "Spend time gardening": "To get started: Plant one seed or tend one potted plant today. To keep going: Grow more plants, learn care tips, and find relaxation and pride in nurturing life.",
    "Do a puzzle": "To get started: Work on a simple puzzle for 10 minutes now. To keep going: Increase complexity, try different puzzles, and see how it improves your concentration over time.",
    "Plan a weekend adventure": "To get started: Pick a nearby place you’ve never visited and plan a short trip. To keep going: Explore a new spot each month, invite friends, and document your experiences with photos.",
    "Create a gratitude jar": "To get started: Write one thing you’re thankful for and drop it in a jar. To keep going: Add one note daily or weekly, revisit them when you need positivity, and watch your gratitude grow.",
    "Try a new workout": "To get started: Attempt a short, different exercise (like a dance workout) today. To keep going: Mix up routines weekly, track which you enjoy, and notice changes in strength or stamina.",
    "Make a playlist of your favorite songs": "To get started: Add 5 songs that always lift your mood. To keep going: Update it each week with new finds, listen during tasks or workouts, and use music to stay motivated.",
    "Declutter your email inbox": "To get started: Delete or archive 5 old emails right now. To keep going: Unsubscribe from irrelevant newsletters, spend a few minutes tidying each week, and enjoy a cleaner inbox.",
    "Send a thank-you note": "To get started: Write a short thank-you message to someone who recently helped you. To keep going: Keep notes handy, send them regularly, and appreciate how gratitude strengthens relationships.",
    "Take a cold shower": "To get started: End your regular shower with 20 seconds of cool water. To keep going: Gradually extend the time, focus on breathing, and enjoy increased alertness and resilience.",
    "Do an online course": "To get started: Enroll in a free mini-course that interests you. To keep going: Set study times, take notes, and apply what you learn to build new skills.",
    "Practice a musical instrument": "To get started: Practice a simple scale or chord for 5 minutes today. To keep going: Increase practice time gradually, learn easy songs, and track improvements in skill and confidence.",
    "Start a creative project": "To get started: Spend 10 minutes brainstorming or outlining your idea. To keep going: Work on it in small steps, set milestones, and celebrate progress at each stage.",
    "Explore a local park": "To get started: Visit a park for a short walk this weekend. To keep going: Try new parks, bring a friend, and notice the mental refresh nature provides.",
    "Create a personal mantra": "To get started: Write a short phrase that inspires you (e.g., “I am capable”). To keep going: Repeat it daily, post it visibly, and update it as your goals evolve.",
    "Learn a magic trick": "To get started: Watch a simple trick tutorial and practice it a few times. To keep going: Learn a new trick each week, show friends, and enjoy building confidence and showmanship.",
    "Take photos of nature": "To get started: Snap a photo of something outdoors that catches your eye today. To keep going: Explore new areas, experiment with angles, and compile a collection that inspires you.",
    "Try a new type of cuisine": "To get started: Pick one dish from a different cuisine and try it today. To keep going: Sample a new dish monthly, learn about its origins, and broaden your culinary horizons.",
    "Experiment with meditation techniques": "To get started: Try a 2-minute guided meditation online. To keep going: Explore different styles (mantras, body scans), track what feels most calming, and build a regular practice.",
    "Read a book on personal development": "To get started: Read one chapter from a book that intrigues you. To keep going: Take notes, apply at least one lesson, and pick another book when you’re done.",
    "Volunteer at an animal shelter": "To get started: Sign up for one volunteer shift or donate supplies. To keep going: Volunteer regularly, learn about animal care, and feel good about making a difference.",
    "Have a picnic outdoors": "To get started: Pack a simple lunch and eat it in a park. To keep going: Try new picnic spots, invite friends, and enjoy the fresh air and scenery.",
    "Plan a day to focus on self-care": "To get started: Choose one relaxing activity (like a bath or reading) and do it today. To keep going: Dedicate a self-care day monthly, try different soothing activities, and notice your mental recharge.",
    "Write down your bucket list": "To get started: List 5 experiences you want to have. To keep going: Add to it over time, mark off completed items, and plan steps to achieve your dreams.",
    "Read a biography": "To get started: Pick a biography and read the first chapter. To keep going: Take notes on key lessons, discuss them with someone, and apply insights to your own life.",
    "Listen to a podcast": "To get started: Find a short, interesting episode and listen today. To keep going: Subscribe to favorites, listen regularly (commutes, chores), and incorporate new insights into daily life.",
    "Visit a local museum": "To get started: Explore one exhibit for an hour. To keep going: Visit different sections, learn about featured topics, and share newfound knowledge with friends.",
    "Paint or draw something": "To get started: Sketch an everyday object in 5 minutes. To keep going: Experiment with mediums, set aside weekly art time, and see how your creativity evolves.",
    "Try a DIY project": "To get started: Choose a simple DIY (like decorating a jar) and do it today. To keep going: Increase complexity as you gain confidence, learn new skills, and enjoy your unique creations.",
    "Practice public speaking": "To get started: Record yourself speaking about a familiar topic for 2 minutes. To keep going: Present to friends or join a speaking group, and track improvements in clarity and confidence.",
    "Start a blog or journal online": "To get started: Write one short post about a topic you care about. To keep going: Post regularly, engage with readers, and refine your writing style over time.",
    "Track your sleep patterns": "To get started: Note your bedtime and wake-up time tonight. To keep going: Use a sleep app or journal, spot patterns, and make small changes to improve rest.",
    "Learn about a historical event": "To get started: Spend 10 minutes reading an overview of an event that intrigues you. To keep going: Dive deeper with documentaries or books, share knowledge with others, and appreciate historical context.",
    "Try a breathing exercise": "To get started: Inhale for 4 counts, exhale for 4, and repeat 5 times. To keep going: Use this when stressed, explore new patterns, and notice calmer reactions to challenges.",
    "Donate items you no longer need": "To get started: Find 3 things to donate today. To keep going: Declutter monthly, drop off donations regularly, and enjoy helping others while simplifying your space.",
    "Learn about a new culture": "To get started: Read a short article about another country’s traditions. To keep going: Watch documentaries, try cultural foods, and broaden your worldview through understanding others.",
    "Practice smiling more often": "To get started: Smile at yourself in the mirror for 30 seconds. To keep going: Smile at coworkers, neighbors, or strangers daily, and notice how it brightens your interactions.",
    "Research a hobby you're interested in": "To get started: Spend 10 minutes learning the basics of a hobby you’ve always considered. To keep going: Gradually gather needed materials, follow tutorials, and practice regularly.",
    "Read a book from a new genre": "To get started: Choose a book outside your comfort zone and read the first chapter. To keep going: Try another new genre next time, discuss with friends, and discover hidden gems.",
    "Spend time stargazing": "To get started: Step outside on a clear night and identify one constellation. To keep going: Learn more constellations, invest in a star map, and enjoy peaceful, awe-inspiring moments.",
    "Try a new sport": "To get started: Attend a beginner class or practice a simple drill today. To keep going: Play regularly, join a group or club, and track improvements in skill and fitness.",
    "Have a screen-free meal": "To get started: Put your phone away during dinner tonight. To keep going: Make every meal screen-free, savor flavors, and enjoy better conversations.",
    "Write about what makes you happy": "To get started: List 3 things that bring you joy. To keep going: Add to the list daily, reflect on it when you’re down, and understand what truly enriches your life.",
    "Plan a surprise for someone": "To get started: Think of a small, thoughtful gesture and do it today. To keep going: Surprise friends or family regularly, get creative, and strengthen your bonds.",
    "Make your bed every morning": "To get started: Make it as soon as you get up today. To keep going: Repeat daily, appreciate starting the day with order, and notice the positive tone it sets.",
    "Try a sound bath meditation": "To get started: Listen to a short sound bath track for a few minutes. To keep going: Explore longer sessions, use them when stressed, and notice deeper relaxation.",
    "Write a short story": "To get started: Set a timer for 10 minutes and write a quick tale without editing. To keep going: Write a new story weekly, experiment with genres, and see your storytelling improve.",
    "Do a random act of kindness for a stranger": "To get started: Offer a helping hand or buy someone a coffee today. To keep going: Make it a regular habit, try different acts, and appreciate how kindness spreads.",
    "Create a healthy smoothie": "To get started: Blend fruit, greens, and yogurt for a quick nutrient boost. To keep going: Try new ingredients, vary recipes, and enjoy how smoothies support your health.",
    "Spend time learning photography": "To get started: Watch a short tutorial and take a few photos. To keep going: Practice different techniques, compare old and new shots, and experiment with lighting and angles.",
    "Review your goals weekly": "To get started: List your main goal and check on it at week’s end. To keep going: Update goals as needed, note progress, and refine your approach each week.",
    "Write a list of things you're thankful for": "To get started: Write 3 things you appreciate right now. To keep going: Add to the list daily, review it when you feel down, and nurture long-term gratitude.",
    "Spend time with a mentor": "To get started: Reach out to someone you admire and ask for a short chat. To keep going: Schedule regular check-ins, seek advice on challenges, and apply their insights to grow.",
    "Learn about minimalism": "To get started: Read one article on minimalism today. To keep going: Gradually declutter, adopt a ‘less is more’ mindset, and enjoy the clarity and focus it brings.",
    "Reflect on your accomplishments": "To get started: Write down one recent achievement you’re proud of. To keep going: Add more accomplishments over time, acknowledge your efforts, and build self-confidence.",
    "Try a stretching routine": "To get started: Stretch for 5 minutes focusing on tight muscles. To keep going: Increase time, explore full-body routines, and enjoy reduced tension and improved mobility.",
    "Organize your computer files": "To get started: Sort one folder and delete unnecessary files. To keep going: Do a quick cleanup monthly, create a simple naming system, and enjoy faster access to what you need.",
    "Visit a farmer's market": "To get started: Go to the next local market and buy at least one fresh item. To keep going: Visit regularly, try new produce, and enjoy supporting local communities.",
    "Create a self-improvement checklist": "To get started: Write down 3 personal growth actions you can take this week. To keep going: Update it as you complete tasks, add new goals, and measure how you evolve over time.",
    "Learn about mindfulness eating": "To get started: During your next meal, eat slowly and savor each bite. To keep going: Minimize distractions, pay attention to hunger cues, and notice improved digestion and pleasure in eating.",
    "Start a workout challenge": "To get started: Commit to exercising for a set number of days (e.g., 5 days) this week. To keep going: Increase difficulty over time, track progress, and celebrate when you complete each challenge.",
    "Reconnect with an old friend": "To get started: Send a quick message or call someone you haven’t spoken to in a while. To keep going: Schedule regular catch-ups, share memories, and strengthen that renewed bond.",
    "Try a new haircare routine": "To get started: Swap one product with a healthier option today. To keep going: Experiment with techniques, track results, and enjoy healthier, more vibrant hair.",
    "Make a list of positive affirmations": "To get started: Write 3 encouraging statements about yourself. To keep going: Read them daily, add new ones, and replace negative self-talk with uplifting words.",
    "Learn to cook a dish from another country": "To get started: Pick a simple international recipe and make it today. To keep going: Try different cuisines monthly, learn about their cultural backgrounds, and broaden your palate.",
    "Have a day of gratitude journaling": "To get started: Dedicate today to writing down every positive thing you notice. To keep going: Repeat this occasionally, review past notes, and maintain a grateful mindset.",
    "Try journaling prompts": "To get started: Pick one prompt online and write about it for 5 minutes. To keep going: Use a new prompt daily, explore different topics, and deepen self-understanding.",
    "Host a game night": "To get started: Invite a friend or two over and play a simple board game. To keep going: Try different games each time, rotate hosting duties, and enjoy fun, screen-free socializing.",
    "Have a movie night with friends": "To get started: Pick a film everyone might enjoy and schedule it this week. To keep going: Alternate movie choices, discuss afterward, and make it a monthly tradition.",
    "Practice speed reading": "To get started: Time yourself reading a short passage and try to go a bit faster. To keep going: Use speed-reading exercises regularly, note improvements, and find a balance between speed and comprehension.",
    "Take a scenic drive": "To get started: Choose a nearby route with nice scenery and drive it today. To keep going: Explore new roads occasionally, bring music or a friend, and appreciate the journey.",
    "Write down your dreams": "To get started: Upon waking, record whatever details you recall. To keep going: Keep a dream journal by your bed, review entries for patterns, and let dreams inspire you.",
    "Track your habits daily": "To get started: Pick one habit and note if you did it today. To keep going: Add more habits, use a habit tracker, and enjoy seeing consistent progress.",
    "Do a random outdoor activity": "To get started: Try something simple like a short bike ride or outdoor yoga today. To keep going: Experiment with different activities (hiking, frisbee), invite others, and discover what you enjoy most.",
    "Research new books to read": "To get started: Look up top recommendations in a genre you like. To keep going: Make a reading wishlist, check reviews, and always have a next book ready.",
    "Visit a nearby town": "To get started: Drive or take a short trip to a neighboring town this weekend. To keep going: Explore different places monthly, try local cafes or shops, and broaden your local horizons.",
    "Clean your phone screen": "To get started: Wipe it down with a microfiber cloth right now. To keep going: Make it a weekly habit, keep cleaning supplies handy, and enjoy a clearer view.",
    "Write a letter to a loved one": "To get started: Take a few minutes and draft a heartfelt note to someone special. To keep going: Send letters regularly, let people know you care, and strengthen those relationships.",
    "Declutter your bookshelf": "To get started: Remove a few books you no longer want. To keep going: Reorganize a section monthly, donate unread books, and enjoy easier access to titles you love.",
    "Plan a budget-friendly vacation": "To get started: Choose a local, affordable destination and research free activities. To keep going: Compare costs, set aside a small travel fund, and enjoy memorable trips without overspending.",
    "Learn about sustainable living": "To get started: Read one article on eco-friendly habits today. To keep going: Adopt one new sustainable practice at a time (recycling, reusable bags), and note the positive impact.",
    "Try to memorize a poem": "To get started: Pick a short poem and memorize the first few lines today. To keep going: Learn the entire piece over several days, recite it often, and appreciate language artistry.",
    "Make a scrapbook": "To get started: Gather a few photos or mementos and arrange them on one page. To keep going: Add pages over time, include meaningful captions, and relive good memories whenever you flip through it.",
    "Spend time birdwatching": "To get started: Step outside and identify one bird species today. To keep going: Learn about local birds, carry binoculars, and enjoy the calm observation of wildlife.",
    "Create a fitness journal": "To get started: Note today’s workout and how you felt afterward. To keep going: Track exercises, progress, and goals, and adjust routines based on what you learn.",
    "Try aromatherapy": "To get started: Diffuse one calming essential oil for a few minutes. To keep going: Experiment with different scents, use them during relaxation times, and note how they affect your mood.",
    "Spend time painting rocks": "To get started: Find a smooth rock and paint a simple design today. To keep going: Paint more rocks with varied patterns, hide them for others to find, and enjoy a creative, low-cost hobby.",
    "Watch a documentary": "To get started: Pick a short, interesting documentary and watch it today. To keep going: Watch a new one weekly, learn about diverse topics, and discuss findings with friends.",
    "Make a daily to-do list": "To get started: Write down 3 tasks to accomplish today. To keep going: Update it every morning, check off completed items, and tweak your approach as you learn what works.",
    "Try intermittent fasting": "To get started: Choose an eating window (e.g., 12 hours) and stick to it today. To keep going: Experiment with different schedules, listen to your body, and track how you feel.",
    "Learn origami": "To get started: Fold a simple paper crane following an online tutorial. To keep going: Try more complex shapes, improve technique, and enjoy making small, beautiful creations.",
    "Practice handwriting": "To get started: Write the alphabet neatly once right now. To keep going: Copy quotes or passages daily, experiment with pens, and see your penmanship improve.",
    "Write a thank-you note": "To get started: Thank someone who supported you recently. To keep going: Send notes regularly, show appreciation often, and strengthen bonds through gratitude.",
    "Plant a tree": "To get started: If possible, plant one seed or sapling in a suitable spot. To keep going: Care for it as it grows, consider planting more, and appreciate your contribution to the environment.",
    "Create a skincare routine": "To get started: Cleanse and moisturize your face tonight. To keep going: Add steps gradually (toner, serum), track improvements, and enjoy healthier skin.",
    "Organize your pantry": "To get started: Sort one shelf, grouping similar items. To keep going: Label containers, rotate stock, and enjoy easier meal prep.",
    "Learn a programming language": "To get started: Complete a short beginner tutorial online. To keep going: Practice a little each day, set small coding challenges, and celebrate when you solve problems independently.",
    "Explore an art gallery": "To get started: Visit a local gallery and spend 20 minutes observing one exhibit. To keep going: Explore more galleries, learn about different art styles, and grow your aesthetic appreciation.",
    "Take part in a charity event": "To get started: Sign up for a local fundraiser or donate to a cause today. To keep going: Attend events regularly, recruit friends to join, and see how your contributions help others.",
    "Do a gratitude meditation": "To get started: Sit quietly and think of one thing you’re grateful for. To keep going: Meditate regularly, focus on different blessings, and notice a more positive mindset.",
    "Focus on reducing waste": "To get started: Bring a reusable bag for shopping today. To keep going: Find ways to reuse, recycle more, and track how much less trash you produce.",
    "Try a new workout class": "To get started: Sign up for a beginner-friendly class online or at a gym. To keep going: Attend classes regularly, try different types (yoga, kickboxing), and note which you enjoy most.",
    "Write down your priorities": "To get started: List your top 3 life priorities right now. To keep going: Review them weekly, adjust as needed, and use them to guide your daily decisions.",
    "Make a vision board": "To get started: Cut out or print a few images that represent your goals. To keep going: Update it as your goals evolve, place it where you’ll see it daily, and review it to stay inspired.",
    "Create a dream journal": "To get started: Write down last night’s dream if you remember it. To keep going: Record dreams regularly, note patterns, and let them spark creativity or insight.",
    "Spend time with a senior citizen": "To get started: Visit or call an older relative or neighbor today. To keep going: Make it a regular event, listen to their stories, and learn from their life experience.",
    "Learn a board game": "To get started: Read the rules of a simple game and try playing it tonight. To keep going: Learn more complex games, invite friends to play, and develop strategic thinking.",
    "Reflect on a life lesson": "To get started: Think of one mistake you learned from recently. To keep going: Write these lessons down, revisit them, and apply them to future decisions.",
    "Write about your favorite memories": "To get started: Describe one happy memory in detail. To keep going: Add new memories periodically, reread them to uplift your mood, and share them with loved ones.",
    "Set new monthly goals": "To get started: Choose one goal for this month. To keep going: Review it at month’s end, set new goals, and celebrate progress as you grow.",
    "Do an act of charity": "To get started: Donate a small amount of money or time to a cause today. To keep going: Make regular contributions, try different forms of charity, and appreciate your positive impact.",
    "Try a morning routine reset": "To get started: Add one beneficial habit (like stretching) to tomorrow morning. To keep going: Refine your routine over time, remove unhelpful habits, and enjoy more energized mornings.",
    "Learn to budget effectively": "To get started: Track today’s expenses. To keep going: Categorize spending weekly, adjust your budget, and watch your savings grow.",
    "Organize your workout gear": "To get started: Put all your workout clothes in one drawer. To keep going: Sort them by activity, ensure easy access, and reduce excuses for skipping workouts.",
    "Read an inspiring book": "To get started: Read the introduction or first chapter of a motivational book. To keep going: Set reading sessions, take notes, and apply the lessons to your life.",
    "Learn about your family history": "To get started: Ask a relative about a family story you don’t know. To keep going: Document these stories, research genealogical records, and appreciate your heritage.",
    "Reflect on your strengths and weaknesses": "To get started: Write one strength and one weakness you have. To keep going: Add more as you discover them, set improvement goals, and notice personal growth.",
    "Try a social media detox": "To get started: Stay off social media for the next two hours. To keep going: Extend this break, turn off notifications, and fill that time with meaningful offline activities.",
    "Read a motivational article": "To get started: Search for an article on a topic that inspires you and read it now. To keep going: Save inspiring articles, revisit them, and share ideas with friends.",
    "Take a new path for your daily walk": "To get started: Choose a different route for your next walk. To keep going: Explore new streets or parks regularly, appreciate fresh scenery, and keep your daily walks interesting.",
    "Learn about a famous inventor": "To get started: Read a short biography of an inventor who changed the world. To keep going: Study more innovators, draw inspiration from their perseverance, and apply their lessons to your life.",
    "Cook a meal from scratch": "To get started: Choose a simple recipe and make it entirely by hand tonight. To keep going: Experiment with more complex dishes, try fresh ingredients, and enjoy self-sufficiency in the kitchen.",
    "Explore a new walking route": "To get started: Pick a nearby trail or street you haven’t explored and walk it today. To keep going: Try a new path each week, track the places you’ve visited, and enjoy the sense of discovery.",
    "Try out journaling for mental health": "To get started: Write down your mood and one worry or gratitude item right now. To keep going: Make this a daily practice, identify patterns, and use insights to reduce stress.",
    "Start a fitness log": "To get started: Write down today’s workout and how you felt afterward. To keep going: Log each session, set progressive goals, and adjust workouts based on your data.",
    "Create a gallery wall": "To get started: Pick a few favorite photos or prints and arrange them on one section of a wall. To keep going: Add more pieces over time, mix art styles, and appreciate your personalized space.",
    "Watch the sunrise": "To get started: Wake up early once this week and watch the sun come up. To keep going: Make it a monthly ritual, notice the calm start it gives you, and reflect on the new day.",
    "Watch the sunset": "To get started: Pause this evening and enjoy the changing colors of the sky. To keep going: Plan sunset viewings regularly, try new locations, and end your day with a moment of peace.",
    "Clean your desk": "To get started: Remove trash and put away loose items right now. To keep going: Tidy up daily, add organizers, and note the improvement in focus and productivity.",
    "Write a positive note to yourself": "To get started: Write one encouraging sentence and place it where you’ll see it. To keep going: Update the note regularly, keep a collection of them, and turn to them for a confidence boost.",
    "Spend 5 minutes in silent reflection": "To get started: Set a timer for 5 minutes, sit quietly, and observe your thoughts. To keep going: Do this daily, gradually extend the time, and enjoy greater mental clarity.",
    "Organize your wardrobe": "To get started: Sort through one drawer or clothing category. To keep going: Organize more sections each week, donate unused clothes, and enjoy hassle-free mornings.",
    "Host a virtual meet-up": "To get started: Invite a few friends to a short video call this week. To keep going: Make it a regular event, try themed discussions, and maintain connections despite distance.",
    "Learn about personal productivity": "To get started: Read one article on time management tips. To keep going: Apply one new technique each week, track results, and refine strategies that work best for you.",
    "Create a meal-prep plan": "To get started: Plan tomorrow’s lunch and prepare it tonight. To keep going: Meal-prep several days at once, try new recipes, and enjoy healthier, stress-free meals.",
    "Start an indoor herb garden": "To get started: Plant one herb in a small pot on your windowsill. To keep going: Add more herbs over time, learn proper care, and enjoy fresh flavors in your cooking.",
    "Learn about your local history": "To get started: Read a short article about a historical event in your town. To keep going: Visit museums, ask longtime residents for stories, and develop pride in your community.",
    "Watch an inspiring TED Talk": "To get started: Pick a short talk on a subject you love and watch it now. To keep going: Watch a new talk weekly, take notes, and apply insights to your personal or professional life.",
    "Try digital art": "To get started: Use a free drawing app to sketch something simple. To keep going: Experiment with tools, follow tutorials, and track your improvement as you practice.",
    "Create a new exercise playlist": "To get started: Add a few upbeat songs you love for your next workout. To keep going: Update it regularly, try new genres, and enjoy how music fuels your exercise sessions.",
    "Try meal prepping for the week": "To get started: Prep one meal in advance for tomorrow. To keep going: Gradually prepare multiple meals, streamline your grocery list, and notice time and stress savings.",
    "Spend an hour tech-free": "To get started: Turn off all screens for the next hour. To keep going: Extend these breaks over time, fill them with hobbies or reading, and enjoy mental refreshment.",
    "Read an inspirational biography": "To get started: Read the first chapter of a biography about someone who overcame adversity. To keep going: Note key lessons, apply them to your life, and share inspiring stories with others.",
    "Learn about the stars": "To get started: Identify one constellation or star tonight. To keep going: Read about astronomy, use apps or star maps, and expand your cosmic perspective.",
    "Create a new morning habit": "To get started: Add one positive action (like a quick stretch) when you wake up tomorrow. To keep going: Build a full routine gradually, experiment with what energizes you, and set a positive tone for the day.",
    "Have a daily reflection session": "To get started: At day’s end, ask yourself what went well and what you can improve. To keep going: Journal these reflections, look for patterns, and make small changes daily.",
    "Do a simple science experiment": "To get started: Try a basic kitchen experiment (like mixing baking soda and vinegar). To keep going: Explore more experiments, learn the science behind them, and spark curiosity.",
    "Learn about financial literacy": "To get started: Read one article on saving or investing today. To keep going: Apply a small tip each month, track changes in your finances, and gain confidence in money management.",
    "Declutter your digital devices": "To get started: Delete 5 unused apps or files right now. To keep going: Clean up monthly, organize folders, and notice better performance and focus.",
    "Find a new motivational quote daily": "To get started: Look up a quote that resonates with you right now. To keep going: Save them, read them each morning, and start your day with positivity.",
    "Take a 30-minute nature walk": "To get started: Set aside 30 minutes to walk in a park today. To keep going: Make it a weekly habit, explore new green spaces, and enjoy the soothing effect of nature.",
    "Write down your travel bucket list": "To get started: List 5 places you’d like to visit. To keep going: Add more destinations, research costs, and start planning your next trip.",
    "Donate to a cause": "To get started: Give a small amount to a charity you trust. To keep going: Budget for regular donations, learn about impact, and consider volunteering time as well.",
    "Try a creative writing exercise": "To get started: Use a writing prompt and write for 5 minutes without stopping. To keep going: Try new prompts weekly, experiment with genres, and watch your writing skills improve.",
    "Spend time in deep breathing exercises": "To get started: Take 5 slow, deep breaths right now. To keep going: Incorporate deep breathing breaks into your day, try different techniques, and notice reduced stress.",
    "Plan your next week's meals": "To get started: Decide on at least one meal for next week. To keep going: Plan more meals, make a shopping list, and enjoy smoother, healthier eating.",
    "Set weekly intentions": "To get started: Choose one intention for the coming week (e.g., “Be more patient”). To keep going: Reflect on it each day, pick new intentions weekly, and observe personal growth.",
    "Try a creative hobby": "To get started: Spend 10 minutes on an artistic activity like sketching or crafting. To keep going: Explore new techniques, dedicate regular time, and appreciate how creativity relaxes and inspires you.",
    "Bake a dessert from scratch": "To get started: Choose a simple recipe (like cookies) and bake it today. To keep going: Try new recipes over time, experiment with flavors, and enjoy sharing treats with others.",
    "Make a plan to stay hydrated": "To get started: Set a goal to drink one extra glass of water today. To keep going: Gradually increase your daily intake, use reminders, and note improvements in focus and energy.",
    "Do something kind for a loved one": "To get started: Perform a small act of kindness (like tidying a shared space) today. To keep going: Keep surprising them with thoughtful gestures, express appreciation often, and deepen your bond."
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

        { name: "edX Business Courses", link: "https://business.edx.org/", category: "Business & Finance" },
        { name: "Coursera Business Specializations", link: "https://www.coursera.org/browse/business", category: "Business & Finance" },
        { name: "HubSpot Academy", link: "https://academy.hubspot.com/", category: "Business & Finance" },
        { name: "Futureskilling (Udemy)", link: "https://www.udemy.com/business/request-demo/?locale=en_US&mx_pg=httpcachecontextsme-list&path=request-demo-mx%2F&ref=ufb_header&user_type=visitor", category: "Business & Finance" },

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
        <EconomicSectorBubbleMap />
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
