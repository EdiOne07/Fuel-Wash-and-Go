import React from 'react';
import Navigation from '../src/navigation/navigation';
import { RadiusProvider } from "./components/RadiusContext";
const App: React.FC = () => {
  return (
    <RadiusProvider>
      <Navigation />
    </RadiusProvider>
  );
};

export default App;
