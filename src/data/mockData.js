export const contacts = [
  { id: 1, name: 'Kamran Khan', phone: '+92 300 1234567', email: 'kamran@email.com', tags: ['Hot Prospect', 'New Lead'], lastActivity: '2m ago', avatar: 'KK' },
  { id: 2, name: 'Zainab Rashid', phone: '+92 301 9876543', email: 'zainab@email.com', tags: ['Hot Prospect'], lastActivity: '1h ago', avatar: 'ZR' },
  { id: 3, name: 'AC Repair Karachi', phone: '+92 321 4567890', email: 'info@acrepair.com', tags: ['Pending'], lastActivity: '3h ago', avatar: 'AC' },
  { id: 4, name: 'Usman Builder', phone: '+92 311 2233445', email: 'usman@builder.com', tags: ['Customer'], lastActivity: '1d ago', avatar: 'UB' },
  { id: 5, name: 'Fatima Ali', phone: '+92 300 9988776', email: 'fatima@email.com', tags: ['New Lead'], lastActivity: '2d ago', avatar: 'FA' },
  { id: 6, name: 'Ahmed Store', phone: '+92 317 6655443', email: 'ahmed@store.com', tags: ['Customer'], lastActivity: '3d ago', avatar: 'AS' },
]

export const leads = {
  'New Lead': [
    { id: 1, name: 'Kamran Khan', budget: '15 Lacs', avatar: 'KK' },
    { id: 2, name: 'Fatima Ali', budget: '8 Lacs', avatar: 'FA' },
    { id: 3, name: 'Usman Builder', budget: '25 Lacs', avatar: 'UB' },
  ],
  'Contacted': [
    { id: 4, name: 'Zainab Rashid', budget: '12 Lacs', avatar: 'ZR' },
    { id: 5, name: 'AC Repair Karachi', budget: '18 Lacs', avatar: 'AC' },
    { id: 6, name: 'Ahmed Store', budget: '5 Lacs', avatar: 'AS' },
  ],
  'Proposal Sent': [
    { id: 7, name: 'Ali Raza', budget: '22 Lacs', avatar: 'AR' },
    { id: 8, name: 'Sarah Home', budget: '10 Lacs', avatar: 'SH' },
  ],
  'Won': [
    { id: 9, name: 'Muhammad Bilal', budget: '15 Lacs', avatar: 'MB' },
    { id: 10, name: 'Karachi Property', budget: '28 Lacs', avatar: 'KP' },
  ],
}

export const appointments = [
  { id: 1, time: '10:00 AM', contact: 'Kamran Khan', purpose: 'Property Discussion', agent: 'Ahsan Ali', status: 'Confirmed', avatar: 'KK' },
  { id: 2, time: '11:30 AM', contact: 'Zainab Rashid', purpose: 'Site Visit', agent: 'Sarah Khan', status: 'Confirmed', avatar: 'ZR' },
  { id: 3, time: '02:00 PM', contact: 'AC Repair Karachi', purpose: 'Proposal Meeting', agent: 'Ahsan Ali', status: 'Pending', avatar: 'AC' },
  { id: 4, time: '04:30 PM', contact: 'Usman Builder', purpose: 'Contract Signing', agent: 'Usman Ahmed', status: 'Confirmed', avatar: 'UB' },
]

export const campaigns = [
  { id: 1, name: 'New Year Offer 2024', date: 'Jan 1, 2024 10:00 AM', sent: 1245, delivered: 1156, read: 892, replied: 156 },
  { id: 2, name: 'Property Investment Tips', date: 'Dec 28, 2023 2:30 PM', sent: 856, delivered: 801, read: 623, replied: 89 },
  { id: 3, name: 'Weekend Special Discount', date: 'Dec 25, 2023 9:00 AM', sent: 2001, delivered: 1943, read: 1567, replied: 234 },
]

export const recentActivity = [
  { id: 1, text: 'Zainab Rashid became a Hot Prospect', time: '2 minutes ago', type: 'prospect' },
  { id: 2, text: 'AC Repair Karachi has an appointment', time: '1 hour ago', type: 'appointment' },
  { id: 3, text: 'Kamran Khan sent a message', time: '3 hours ago', type: 'message' },
  { id: 4, text: 'New lead from Website', time: '5 hours ago', type: 'lead' },
]

export const topAgents = [
  { name: 'Ahsan Ali', chats: 156, percent: 85, avatar: 'AA' },
  { name: 'Sarah Khan', chats: 142, percent: 78, avatar: 'SK' },
  { name: 'Usman Ahmed', chats: 98, percent: 72, avatar: 'UA' },
]

export const chartData = [
  { date: '01 Jan', leads: 40, conversations: 30 },
  { date: '06 Jan', leads: 80, conversations: 60 },
  { date: '11 Jan', leads: 60, conversations: 90 },
  { date: '16 Jan', leads: 110, conversations: 70 },
  { date: '21 Jan', leads: 90, conversations: 110 },
  { date: '26 Jan', leads: 130, conversations: 95 },
  { date: '31 Jan', leads: 120, conversations: 140 },
]

export const leadSourceData = [
  { name: 'WhatsApp', value: 40, color: '#16a34a' },
  { name: 'Website', value: 25, color: '#86efac' },
  { name: 'Facebook', value: 20, color: '#bbf7d0' },
  { name: 'Referral', value: 15, color: '#4ade80' },
]

export const navLinks = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: 'dashboard' },
  { label: 'Active Chats', icon: 'MessageCircle', path: 'chats', badge: 12 },
  { label: 'Contacts', icon: 'Users', path: 'contacts' },
  { label: 'Leads', icon: 'TrendingUp', path: 'leads' },
  { label: 'Appointments', icon: 'Calendar', path: 'appointments' },
  { label: 'Broadcast', icon: 'Megaphone', path: 'broadcast' },
  { label: 'Automation', icon: 'Zap', path: 'automation' },
  { label: 'Reports', icon: 'BarChart2', path: 'reports' },
  { label: 'Settings', icon: 'Settings', path: 'settings' },
]
