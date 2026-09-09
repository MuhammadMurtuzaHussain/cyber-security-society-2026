import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { GameProvider } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Achievements from "./pages/Achievements";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import IsacaEvent from "./pages/IsacaEvent";
import Leaderboard from "./pages/Leaderboard";
import MissionPlay from "./pages/MissionPlay";
import Missions from "./pages/Missions";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/missions" component={Missions} />
    <Route path="/missions/isaca-invitation" component={IsacaEvent} />
    <Route path="/missions/:id" component={MissionPlay} />
    <Route path="/leaderboard" component={Leaderboard} />
    <Route path="/achievements" component={Achievements} />
    <Route path="/profile" component={Profile} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><GameProvider><Toaster theme="dark" richColors position="top-right" /><Router /></GameProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
