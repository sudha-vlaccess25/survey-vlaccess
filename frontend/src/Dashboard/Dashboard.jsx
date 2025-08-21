import React, { useState } from "react";
import {
  Home,
  ClipboardList,
  Users,
  BarChart2,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  CheckCircle,
  Clock,
  Settings,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

// --- MOCK DATA (remains unchanged) ---
const dailyData = [
  { name: "Mon", value: 50 },
  { name: "Tue", value: 70 },
  { name: "Wed", value: 65 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 80 },
  { name: "Sat", value: 60 },
  { name: "Sun", value: 75 },
];
const weeklyData = [
  { name: "Week 1", value: 200 },
  { name: "Week 2", value: 250 },
  { name: "Week 3", value: 180 },
  { name: "Week 4", value: 300 },
];
const monthlyData = [
  { name: "Apr 10", value: 65 },
  { name: "Apr 11", value: 35 },
  { name: "Apr 12", value: 80 },
  { name: "Apr 13", value: 100 },
  { name: "Apr 14", value: 70 },
  { name: "Apr 15", value: 95 },
  { name: "Apr 16", value: 75 },
];
const quarterlyData = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 60 },
  { name: "Mar", value: 85 },
];

const yearlyData = [
  { name: "Jan", value: 72 },
  { name: "Feb", value: 65 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 68 },
  { name: "May", value: 75 },
  { name: "Jun", value: 70 },
  { name: "Jul", value: 85 },
  { name: "Aug", value: 77 },
  { name: "Sep", value: 62 },
  { name: "Oct", value: 90 },
  { name: "Nov", value: 74 },
  { name: "Dec", value: 88 },
];

const chartDataSets = {
  Daily: dailyData,
  Weekly: weeklyData,
  Monthly: monthlyData,
  Quarterly: quarterlyData,
  Yearly: yearlyData,
};
const surveyData = [
  {
    no: "01",
    list: "Omfed Cuttack - Industry",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "In Progress",
  },
  {
    no: "02",
    list: "Sambalpur City Surveillance",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "Not Started",
  },
  {
    no: "03",
    list: "Berhampur City Surveillance",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "In Progress",
  },
  {
    no: "04",
    list: "MSL Delhi Industry",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "In Progress",
  },
  {
    no: "05",
    list: "ARD- Khurda CDVO",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "Completed",
  },
  {
    no: "06",
    list: "ARD- Anugul CDVO",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "In Progress",
  },
  {
    no: "07",
    list: "ARD- Dhenkanal CDVO",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "Completed",
  },
  {
    no: "08",
    list: "ARD- Cuttack SDVO",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "Not Started",
  },
  {
    no: "09",
    list: "ARD- Puri CDVO",
    startDate: "12 May 2024",
    dueDate: "12 May 2024",
    status: "In Progress",
  },
];

// --- COMPONENTS (remains unchanged) ---
const StatusPill = ({ status }) => {
  let classes = "";
  if (status === "In Progress") classes = "bg-sky-100 text-sky-600";
  else if (status === "Not Started") classes = "bg-red-100 text-red-600";
  else if (status === "Completed") classes = "bg-green-100 text-green-600";
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${classes} whitespace-nowrap`}
    >
      {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-lg">
        <p className="text-sm font-bold text-gray-800">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("Monthly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setIsDropdownOpen(false);
  };

  const currentChartData = chartDataSets[timeframe];

  return (
    <div className="relative min-h-screen bg-[#F9F9F9] font-sans">
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      {/* CHANGED:
        - Removed `md:relative`
        - The sidebar is now `fixed` on all screen sizes to keep it from scrolling.
        - `h-screen` ensures it always takes the full viewport height.
      */}
      <aside
        className={`w-64 bg-[#111827] text-gray-300 flex flex-col justify-between fixed h-screen inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg">
                <img src="/vlaccess_logo.png" className="w-7 h-7" alt="" />
              </div>
              <div className="text-2xl font-bold text-white">Survey</div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            <a
              className="flex items-center px-3 py-2 bg-gray-700 text-white rounded-lg"
              href="#"
            >
              <Home className="mr-3 w-6 h-6" /> Dashboard
            </a>

            <a
              className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg"
              href="#"
            >
              <ClipboardList className="mr-3 w-5 h-5" /> Surveys
            </a>

            <a
              className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg"
              href="#"
            >
              <Users className="mr-3 w-5 h-5" /> Supervisors
            </a>

            <a
              className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg"
              href="#"
            >
              <BarChart2 className="mr-3 w-5 h-5" /> Reports
            </a>

            <a
              className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg"
              href="#"
            >
              <MessageSquare className="mr-3 w-5 h-5" /> Message
            </a>
          </nav>
        </div>
        <div className="p-4">
          <a
            href="#"
            className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg"
          >
            <LogOut className="mr-3 w-5 h-5" /> Log Out
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      {/* CHANGED:
        - Added `md:ml-64`. Since the sidebar is now fixed, this margin prevents
          the main content from being hidden underneath it on medium screens and up.
      */}
      <main className="p-4 md:p-8 md:ml-64">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Hey Surveyor.
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Welcome back! Your goal is to provide an errorless survey
                report.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
              />
            </div>
            <Settings className="w-6 h-6 text-gray-500 cursor-pointer hidden sm:block" />
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer hidden sm:block" />
            <img
              src={`https://i.pravatar.cc/150?u=a042581f4e29026704d`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5 flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">80%</div>
                  <p className="text-gray-500 text-sm">Completion</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">21</div>
                  <p className="text-gray-500 text-sm">Survey Completed</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">64%</div>
                  <p className="text-gray-500 text-sm">Ongoing</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">03</div>
                  <p className="text-gray-500 text-sm">Survey Missed</p>
                </div>
              </div>
            </div>
            {/* --- SURVEY ACTIVITIES CHART --- */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="font-bold text-xl text-gray-800">
                  Survey Activities
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg flex items-center"
                  >
                    {timeframe} <ChevronDown className="inline h-4 w-4 ml-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10">
                      {Object.keys(chartDataSets).map((option) => (
                        <a
                          key={option}
                          href="#"
                          onClick={() => handleTimeframeChange(option)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {option}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentChartData}
                    margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FDE68A"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FDE68A"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, "dataMax + 10"]}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: "#facc15",
                        strokeWidth: 1,
                        strokeDasharray: "5 5",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="transparent"
                      fill="url(#colorValue)"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#facc15"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: "#facc15",
                        stroke: "white",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800">
                  Notice Board
                </h2>
                <a href="#" className="text-sm text-gray-500">
                  View all
                </a>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-sm text-gray-700">
                      Survey On V3-HIKSA postponed
                    </p>
                    <p className="text-xs text-gray-400">
                      Postponed to tomorrow due to some registration issue
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1 flex-shrink-0">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-sm text-gray-700">
                      ARD-Khurda prepared
                    </p>
                    <p className="text-xs text-gray-400">
                      Please complete the task on 12th May 2024, as there is a
                      public holiday
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800">Messages</h2>
                <MoreHorizontal className="text-gray-500" />
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pravatar.cc/150?u=jane"
                    alt="Jane"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">Jane Cooper</p>
                    <p className="text-xs text-gray-500">
                      Sent frag met blo op...
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pravatar.cc/150?u=kristin"
                    alt="Kristin"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">Kristin Watson</p>
                    <p className="text-xs text-gray-500">See you at 5 pm</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pravatar.cc/150?u=jenny"
                    alt="Jenny"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">Jenny Wilson</p>
                    <p className="text-xs text-gray-500">Wow!!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pravatar.cc/150?u=brooklyn"
                    alt="Brooklyn"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">Brooklyn Sim</p>
                    <p className="text-xs text-gray-500">Sent you a message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SURVEY TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="font-bold text-lg text-gray-800">
              Survey Assigned.
            </h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Subject"
                className="pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="text-gray-400 text-sm border-b">
                  <th className="py-3 font-medium px-2">Sl. No</th>
                  <th className="py-3 font-medium px-2">Survey lists</th>
                  <th className="py-3 font-medium px-2">Start Date</th>
                  <th className="py-3 font-medium px-2">Due Date</th>
                  <th className="py-3 font-medium px-2">Status</th>
                  <th className="py-3 font-medium px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {surveyData.map((s) => (
                  <tr key={s.no} className="border-b">
                    <td className="py-4 px-2">{s.no}</td>
                    <td className="py-4 px-2 font-medium">{s.list}</td>
                    <td className="py-4 px-2 whitespace-nowrap">
                      {s.startDate}
                    </td>
                    <td className="py-4 px-2 whitespace-nowrap">{s.dueDate}</td>
                    <td className="py-4 px-2">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-500 gap-3">
            <button className="px-3 py-1 border rounded-lg flex items-center hover:bg-gray-50">
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            <div>Page 1 of 12</div>
            <button className="px-3 py-1 border rounded-lg flex items-center hover:bg-gray-50">
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
