import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Solver } from './pages/Solver';
import { History } from './pages/History';
import { FeaturesSection } from './components/features/FeaturesSection';
import { HowItWorks } from './components/features/HowItWorks';
import { FAQ } from './components/features/FAQ';
import { SolverProvider } from './context/SolverContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <SolverProvider>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          
          <main className="flex-1 w-full overflow-x-hidden">
            {/* Home / Hero */}
            <Home />
            
            {/* Solver */}
            <Solver />
            
            {/* Features */}
            <FeaturesSection />
            
            {/* How It Works */}
            <HowItWorks />
            
            {/* History */}
            <History />
            
            {/* FAQ */}
            <FAQ />
          </main>
          
          <Footer />
        </div>
      </SolverProvider>
    </ThemeProvider>
  );
}

export default App;
