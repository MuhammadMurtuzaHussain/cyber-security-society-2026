import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { useEffect } from "react";
import { useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { GameProvider } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Achievements from "./pages/Achievements";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import MissionPlay from "./pages/MissionPlay";
import Missions from "./pages/Missions";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

function RouterView() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/missions" component={Missions} />
    <Route path="/missions/:id" component={MissionPlay} />
    <Route path="/leaderboard" component={Leaderboard} />
    <Route path="/achievements" component={Achievements} />
    <Route path="/profile" component={Profile} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><GameProvider><Toaster theme="dark" richColors position="top-right" /><Router hook={useHashLocation}><RouterView /></Router></GameProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
