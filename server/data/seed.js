require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Idea = require('../models/Idea');
const Team = require('../models/Team');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');
  await User.deleteMany({});
  await Idea.deleteMany({});
  await Team.deleteMany({});

  // ── 5 USERS ──────────────────────────────────────────────────────
  const pw = await bcrypt.hash('demo1234', 10);
  const [sudharshan, priya, arjun, kavitha, rahul] = await User.insertMany([
    {
      name: 'Sudharshan R', email: 'sudharshan@kct.ac.in', password: pw,
      rollNumber: '22EIE001', department: 'EIE', year: 1,
      skills: ['Python', 'React', 'Arduino', 'C'],
      interests: ['Robotics', 'AI/ML', 'IoT'],
      experienceLevel: 'intermediate',
      bio: 'Building SkillSync to fix collaboration at KCT. Interested in robotics and AI.',
      githubUsername: 'sudharshan-kct', reputationScore: 42,
    },
    {
      name: 'Priya Meenakshi', email: 'priya@kct.ac.in', password: pw,
      rollNumber: '22CSE045', department: 'CSE', year: 2,
      skills: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'UI/UX Design'],
      interests: ['Full Stack', 'UI/UX', 'EdTech'],
      experienceLevel: 'intermediate',
      bio: 'Full-stack dev who loves clean UI and fast products.',
      githubUsername: 'priyam-kct', reputationScore: 68,
    },
    {
      name: 'Arjun Senthil', email: 'arjun@kct.ac.in', password: pw,
      rollNumber: '21CSE102', department: 'CSE', year: 3,
      skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Flask', 'ML'],
      interests: ['Machine Learning', 'Data Science', 'Computer Vision'],
      experienceLevel: 'advanced',
      bio: 'ML researcher. 2 conference papers. Building models that matter.',
      githubUsername: 'arjun-ml', reputationScore: 94,
    },
    {
      name: 'Kavitha Lakshmi', email: 'kavitha@kct.ac.in', password: pw,
      rollNumber: '22MECH010', department: 'Mechanical', year: 2,
      skills: ['SolidWorks', 'AutoCAD', 'MATLAB', '3D Printing'],
      interests: ['Robotics', 'Manufacturing', 'CAD Design'],
      experienceLevel: 'intermediate',
      bio: 'Mechanical engineer with a passion for robotics and fabrication.',
      githubUsername: '', reputationScore: 31,
    },
    {
      name: 'Rahul Krishnan', email: 'rahul@kct.ac.in', password: pw,
      rollNumber: '21ECE077', department: 'ECE', year: 3,
      skills: ['Embedded C', 'Arduino', 'Raspberry Pi', 'PCB Design'],
      interests: ['Embedded Systems', 'IoT', 'VLSI'],
      experienceLevel: 'advanced',
      bio: 'Embedded systems dev. Building hardware for healthcare applications.',
      githubUsername: 'rahul-ece', reputationScore: 78,
    },
  ]);
  console.log('✓ 5 users created');

  // ── 8 IDEAS ──────────────────────────────────────────────────────
  const now = Date.now();
  const day = 86400000;

  const [i1, i2, i3, i4, i5, i6, i7, i8] = await Idea.insertMany([
    {
      title: 'AI-Powered Campus Navigation App',
      abstract: 'A mobile app using computer vision and AR to help new students navigate KCT. Maps all labs, departments, and canteen routes. ML predicts crowd density at peak hours and suggests optimal paths. Built with Flutter and TensorFlow Lite.',
      requiredSkills: ['Flutter', 'Python', 'TensorFlow', 'Firebase', 'UI/UX Design'],
      scope: '6-month project — MVP in 8 weeks', teamSize: 5,
      status: 'open', owner: sudharshan._id,
      teamMembers: [{ user: sudharshan._id, role: 'Owner' }],
      tags: ['mobile', 'AR', 'ML', 'campus'],
      bookmarkCount: 23, viewCount: 140,
      createdAt: new Date(now - 2 * day),
    },
    {
      title: 'Smart Attendance using Face Recognition',
      abstract: 'Replace manual roll calls with automated facial recognition for classrooms. Faculty gets a dashboard showing attendance trends. Students get instant notifications. Raspberry Pi camera + OpenCV + Flask backend.',
      requiredSkills: ['Python', 'OpenCV', 'Raspberry Pi', 'React', 'Flask'],
      scope: '4-month project — demo-ready in 6 weeks', teamSize: 4,
      status: 'forming', owner: priya._id,
      teamMembers: [{ user: priya._id, role: 'Owner' }, { user: sudharshan._id, role: 'Frontend Dev' }],
      applicants: [{ user: arjun._id, message: 'I can handle the ML model side.', status: 'pending' }],
      tags: ['computer vision', 'hardware', 'automation'],
      bookmarkCount: 35, viewCount: 210,
      createdAt: new Date(now - 5 * day),
    },
    {
      title: 'Dengue Outbreak Prediction Dashboard',
      abstract: 'Predicts dengue outbreak risk at district level across Tamil Nadu Tier-2 cities using Random Forest. Real-time map with risk heatmaps. Data from government health portals and weather APIs. Submitted for KCT innovation program.',
      requiredSkills: ['Python', 'Scikit-learn', 'React', 'Leaflet.js', 'Flask'],
      scope: '3-month project — submitted for college innovation program', teamSize: 4,
      status: 'active', owner: arjun._id,
      teamMembers: [{ user: arjun._id, role: 'ML Lead' }, { user: priya._id, role: 'Frontend' }, { user: sudharshan._id, role: 'Backend' }],
      tags: ['ML', 'healthcare', 'data science', 'Tamil Nadu'],
      bookmarkCount: 41, viewCount: 290,
      githubRepo: 'https://github.com/kct-collab/dengue-watch',
      createdAt: new Date(now - 10 * day),
    },
    {
      title: '3D-Printed Prosthetic Hand with Servo Control',
      abstract: 'Low-cost prosthetic hand controlled by EMG signals from the forearm. 3D-printed structure with servo actuation and Arduino control. Goal: under ₹3,000 total cost vs ₹50,000+ commercial alternatives.',
      requiredSkills: ['Arduino', '3D Printing', 'Embedded C', 'SolidWorks', 'Electronics'],
      scope: '6-month project', teamSize: 4,
      status: 'forming', owner: kavitha._id,
      teamMembers: [{ user: kavitha._id, role: 'Hardware Lead' }, { user: rahul._id, role: 'Embedded' }],
      tags: ['hardware', 'medical', 'robotics', 'social impact'],
      bookmarkCount: 58, viewCount: 380,
      createdAt: new Date(now - 7 * day),
    },
    {
      title: 'IoT-Based Smart Campus Energy Monitor',
      abstract: 'Sensors deployed across KCT track electricity usage per building in real time. Dashboard shows wastage hotspots. Automated admin alerts when usage exceeds threshold. Target: reduce college electricity bill by 20%.',
      requiredSkills: ['Arduino', 'Raspberry Pi', 'React', 'Python', 'MongoDB'],
      scope: '5-month project', teamSize: 5,
      status: 'open', owner: rahul._id,
      teamMembers: [{ user: rahul._id, role: 'Hardware Lead' }],
      tags: ['IoT', 'sustainability', 'hardware', 'campus'],
      bookmarkCount: 19, viewCount: 95,
      createdAt: new Date(now - 3 * day),
    },
    {
      title: 'Peer-to-Peer Skill Exchange Platform',
      abstract: 'Students teach and learn from each other using a time-banking model. Guitar for coding. Design for Math. Each session earns skill credits redeemable for other sessions. Real-time matching and scheduling.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'UI/UX Design'],
      scope: '3-month project — MVP in 5 weeks', teamSize: 4,
      status: 'open', owner: priya._id,
      teamMembers: [{ user: priya._id, role: 'Owner' }],
      tags: ['marketplace', 'education', 'social'],
      bookmarkCount: 27, viewCount: 168,
      createdAt: new Date(now - 1 * day),
    },
    {
      title: 'Student Mental Health Companion App',
      abstract: 'Anonymous peer support app for students facing academic pressure. AI chatbot for first-response. Connects to trained peer counsellors within the college. All data fully anonymised and encrypted.',
      requiredSkills: ['Flutter', 'Python', 'NLP', 'Firebase', 'UI/UX Design'],
      scope: '4-month project', teamSize: 4,
      status: 'open', owner: sudharshan._id,
      teamMembers: [{ user: sudharshan._id, role: 'Owner' }],
      tags: ['mental health', 'mobile', 'AI', 'social impact'],
      bookmarkCount: 47, viewCount: 310,
      createdAt: new Date(now - 4 * day),
    },
    {
      title: 'Sign Language to Text Translator',
      abstract: 'Real-time Indian Sign Language (ISL) to text translation using webcam and hand landmark detection via MediaPipe. Trained on ISL dataset with 500+ signs. Helps deaf students communicate in classrooms.',
      requiredSkills: ['Python', 'MediaPipe', 'TensorFlow', 'React', 'OpenCV'],
      scope: '5-month project', teamSize: 4,
      status: 'open', owner: arjun._id,
      teamMembers: [{ user: arjun._id, role: 'ML Lead' }],
      tags: ['accessibility', 'ML', 'computer vision', 'social impact'],
      bookmarkCount: 33, viewCount: 220,
      createdAt: new Date(now - 6 * day),
    },
  ]);
  console.log('✓ 8 ideas created');

  // ── 3 TEAMS ──────────────────────────────────────────────────────
  const makeDate = (hoursAgo) => new Date(now - hoursAgo * 3600000);

  await Team.insertMany([
    {
      idea: i2._id, name: 'FaceIn Team', status: 'forming',
      members: [
        { user: priya._id, role: 'Owner' },
        { user: sudharshan._id, role: 'Frontend Dev' },
      ],
      tasks: [
        { title: 'Set up Raspberry Pi camera module', assignee: sudharshan._id, status: 'done' },
        { title: 'Train face recognition model on student dataset', assignee: priya._id, status: 'inprogress' },
        { title: 'Build attendance dashboard in React', assignee: priya._id, status: 'todo' },
        { title: 'Flask API for model inference', assignee: sudharshan._id, status: 'todo' },
      ],
      milestones: [
        { title: 'Camera + model prototype', dueDate: new Date(now + 7 * day), completed: false },
        { title: 'Faculty demo at KCT', dueDate: new Date(now + 21 * day), completed: false },
        { title: 'Classroom pilot (50 students)', dueDate: new Date(now + 45 * day), completed: false },
      ],
      chatMessages: [
        { sender: priya._id, senderName: 'Priya Meenakshi', text: 'Hey! Camera module setup done. Getting 30fps stream ✓', sentAt: makeDate(6) },
        { sender: sudharshan._id, senderName: 'Sudharshan R', text: 'Nice! I\'ll start the Flask inference endpoint today.', sentAt: makeDate(5) },
        { sender: priya._id, senderName: 'Priya Meenakshi', text: 'The model accuracy is at 91% with 200 student images. Should be better at 500.', sentAt: makeDate(4) },
        { sender: sudharshan._id, senderName: 'Sudharshan R', text: 'Can we do a trial run in Lab 3 this Friday?', sentAt: makeDate(2) },
        { sender: priya._id, senderName: 'Priya Meenakshi', text: 'Friday works. I\'ll ask Dr. Daisy for permission.', sentAt: makeDate(1) },
        { sender: sudharshan._id, senderName: 'Sudharshan R', text: 'Also — Arjun applied. His ML profile is really strong. Should we add him?', sentAt: makeDate(0.5) },
      ],
      githubRepo: 'https://github.com/kct-collab/facein',
    },
    {
      idea: i3._id, name: 'Dengue Watch', status: 'active',
      members: [
        { user: arjun._id, role: 'ML Lead' },
        { user: priya._id, role: 'Frontend' },
        { user: sudharshan._id, role: 'Backend' },
      ],
      tasks: [
        { title: 'Collect district-level dengue datasets (2018–2024)', assignee: arjun._id, status: 'done' },
        { title: 'Train Random Forest model — target F1 > 0.85', assignee: arjun._id, status: 'done' },
        { title: 'Build Leaflet.js risk heatmap', assignee: priya._id, status: 'done' },
        { title: 'Flask API for model predictions', assignee: sudharshan._id, status: 'inprogress' },
        { title: 'Connect live weather API data feed', assignee: sudharshan._id, status: 'inprogress' },
        { title: 'Write innovation challenge report', assignee: arjun._id, status: 'todo' },
      ],
      milestones: [
        { title: 'Model trained + API live', dueDate: new Date(now - 3 * day), completed: true },
        { title: 'Dashboard deployed', dueDate: new Date(now + 5 * day), completed: false },
        { title: 'Innovation challenge submission', dueDate: new Date(now + 12 * day), completed: false },
      ],
      chatMessages: [
        { sender: arjun._id, senderName: 'Arjun Senthil', text: 'Model is live! F1 score: 0.87 on 2024 test data. 🎯', sentAt: makeDate(48) },
        { sender: priya._id, senderName: 'Priya Meenakshi', text: 'The heatmap is looking really clean. Sharing a screenshot in files.', sentAt: makeDate(36) },
        { sender: sudharshan._id, senderName: 'Sudharshan R', text: 'Flask API deployed on Render. Response time is under 200ms.', sentAt: makeDate(24) },
        { sender: arjun._id, senderName: 'Arjun Senthil', text: 'Perfect. Let\'s connect the weather feed this week and we\'re demo-ready.', sentAt: makeDate(18) },
        { sender: priya._id, senderName: 'Priya Meenakshi', text: 'The innovation challenge deadline is in 12 days. Report needs to be done by day 8.', sentAt: makeDate(6) },
        { sender: sudharshan._id, senderName: 'Sudharshan R', text: 'I\'ll draft the technical architecture section. @Arjun, you do the ML methodology?', sentAt: makeDate(3) },
        { sender: arjun._id, senderName: 'Arjun Senthil', text: 'Yes, on it. Will also add benchmark comparisons with previous models.', sentAt: makeDate(1) },
      ],
      githubRepo: 'https://github.com/kct-collab/dengue-watch',
    },
    {
      idea: i4._id, name: 'ProstHand Builders', status: 'forming',
      members: [
        { user: kavitha._id, role: 'Hardware Lead' },
        { user: rahul._id, role: 'Embedded Systems' },
      ],
      tasks: [
        { title: 'Design finger joint mechanism in SolidWorks', assignee: kavitha._id, status: 'done' },
        { title: '3D print prototype hand (PLA material)', assignee: kavitha._id, status: 'inprogress' },
        { title: 'EMG sensor circuit design', assignee: rahul._id, status: 'inprogress' },
        { title: 'Arduino servo control code', assignee: rahul._id, status: 'todo' },
        { title: 'Calibrate EMG threshold values per user', assignee: rahul._id, status: 'todo' },
      ],
      milestones: [
        { title: 'Physical prototype complete', dueDate: new Date(now + 10 * day), completed: false },
        { title: 'EMG control working', dueDate: new Date(now + 25 * day), completed: false },
        { title: 'Kryptos fest demo', dueDate: new Date(now + 40 * day), completed: false },
      ],
      chatMessages: [
        { sender: kavitha._id, senderName: 'Kavitha Lakshmi', text: 'SolidWorks model done. Sending to 3D printer tomorrow morning.', sentAt: makeDate(72) },
        { sender: rahul._id, senderName: 'Rahul Krishnan', text: 'EMG sensor arrived! ADS1115 ADC module. Signal looks clean on oscilloscope.', sentAt: makeDate(48) },
        { sender: kavitha._id, senderName: 'Kavitha Lakshmi', text: 'Print time is 11 hours. Starting tonight. Fingers crossed 🤞', sentAt: makeDate(36) },
        { sender: rahul._id, senderName: 'Rahul Krishnan', text: 'Working on servo PWM control. Getting 0–180° range working reliably.', sentAt: makeDate(24) },
        { sender: kavitha._id, senderName: 'Kavitha Lakshmi', text: 'Print came out well! Minor warping on the thumb — will reprint that part only.', sentAt: makeDate(12) },
        { sender: rahul._id, senderName: 'Rahul Krishnan', text: 'Total cost so far: ₹2,640. Still under budget. Let\'s try to keep it under ₹3,000 final.', sentAt: makeDate(4) },
      ],
      githubRepo: 'https://github.com/kct-collab/prosthand',
    },
  ]);
  console.log('✓ 3 teams created');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅  Seed complete! Login with any of these:');
  console.log('   sudharshan@kct.ac.in / demo1234');
  console.log('   priya@kct.ac.in      / demo1234');
  console.log('   arjun@kct.ac.in      / demo1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
