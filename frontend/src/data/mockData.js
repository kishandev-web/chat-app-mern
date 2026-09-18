export const users = [
  {
    id: 'u1',
    name: 'Elon Musk',
    avatar: 'https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIxfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    status: 'Online',
    about: 'Occupy Mars 🚀',
    phone: '+1 420-690-000',
  },
  {
    id: 'u2',
    name: 'Bill Gates',
    avatar: 'https://images.unsplash.com/photo-1445053023192-8d45cb66099d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIzfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    status: 'Last seen today at 12:45 PM',
    about: 'I like books 📚',
    phone: '+1 123-456-789',
  },
  {
    id: 'u3',
    name: 'Mark Zuckerberg',
    avatar: 'https://images.unsplash.com/photo-1774413769417-29fde33e368b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    status: 'Typing...',
    about: 'Metaverse is coming 👓',
    phone: '+1 000-000-001',
  },
  {
    id: 'u4',
    name: 'Jeff Bezos',
    avatar: 'https://images.unsplash.com/photo-1776781205743-33b4c1106adc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQxfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    status: 'Offline',
    about: 'Alexa, buy the moon 📦',
    phone: '+1 999-999-999',
  },
  {
    id: 'u5',
    name: 'Sundar Pichai',
    avatar: 'https://images.unsplash.com/photo-1776356682393-9c92f844d2ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU5fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    status: 'Online',
    about: 'AI for everyone 🤖',
    phone: '+1 888-888-888',
  }
];

export const chats = [
  {
    id: 'c1',
    user: users[0],
    lastMessage: 'Let\'s talk about Starship!',
    timestamp: '10:30 AM',
    unreadCount: 2,
    pinned: true,
  },
  {
    id: 'c2',
    user: users[1],
    lastMessage: 'Did you see the new book list?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'c3',
    user: users[2],
    lastMessage: 'Are you ready for the metaverse?',
    timestamp: '8:45 AM',
    unreadCount: 5,
    pinned: false,
  },
  {
    id: 'c4',
    user: users[3],
    lastMessage: 'I need a bigger warehouse.',
    timestamp: '2 days ago',
    unreadCount: 0,
    pinned: false,
  },
];

export const messages = {
  'c1': [
    { id: 'm1', text: 'Hey there!', sender: 'u1', timestamp: '10:00 AM', status: 'read' },
    { id: 'm2', text: 'Hello Elon!', sender: 'me', timestamp: '10:05 AM', status: 'read' },
    { id: 'm3', text: 'When is the next launch?', sender: 'me', timestamp: '10:10 AM', status: 'read' },
    { id: 'm4', text: 'Let\'s talk about Starship!', sender: 'u1', timestamp: '10:30 AM', status: 'sent' },
  ]
};

export const stories = [
  { id: 's1', user: users[0], viewed: false },
  { id: 's2', user: users[1], viewed: true },
  { id: 's3', user: users[2], viewed: false },
  { id: 's4', user: users[3], viewed: false },
  { id: 's5', user: users[4], viewed: true },
];

export const calls = [
  { id: 'ca1', user: users[0], type: 'video', status: 'incoming', timestamp: 'Today, 10:30 AM' },
  { id: 'ca2', user: users[1], type: 'audio', status: 'missed', timestamp: 'Yesterday, 8:45 PM' },
  { id: 'ca3', user: users[2], type: 'video', status: 'outgoing', timestamp: 'May 5, 2:15 PM' },
];
