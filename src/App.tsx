import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModelsCatalog from './pages/ModelsCatalog';
import BlueprintsCatalog from './pages/BlueprintsCatalog';
import GPUCloud from './pages/GPUCloud';
import ModelDetail from './pages/ModelDetail';
import BlueprintDetail from './pages/BlueprintDetail';
import FunctionalServiceDetail from './pages/FunctionalServiceDetail';

function App() {
  return (
    <Router>
      <Routes>
           <Route path="/" element={<Navigate to="/models" replace />} />
           <Route path="/models" element={<ModelsCatalog />} />
	   <Route path="/models/:modelId/*" element={<ModelDetail />} />
           <Route path="/blueprints" element={<BlueprintsCatalog />} />
           <Route path="/blueprints/:blueprintId" element={<BlueprintDetail />} />
           <Route path="/services/:serviceId" element={<FunctionalServiceDetail />} />
           <Route path="/gpu-cloud" element={<GPUCloud />} />
      </Routes>
    </Router>
  );
}

export default App;
