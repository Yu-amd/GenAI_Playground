import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ModelsCatalog from './pages/ModelsCatalog';
import BlueprintsCatalog from './pages/BlueprintsCatalog';
import GPUCloud from './pages/GPUCloud';
import CloudDeployment from './pages/CloudDeployment';
import Deploy from './pages/Deploy';
import ModelDetail from './pages/ModelDetail';
import BlueprintDetail from './pages/BlueprintDetail';
import FunctionalServiceDetail from './pages/FunctionalServiceDetail';
import ContentEditorDemo from './pages/ContentEditorDemo';

// Import services to register cloud provider adapters
import './services';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/models' element={<ModelsCatalog />} />
        <Route path='/models/:modelId/*' element={<ModelDetail />} />
        <Route path='/blueprints' element={<BlueprintsCatalog />} />
        <Route path='/blueprints/:blueprintId' element={<BlueprintDetail />} />
        <Route
          path='/services/:serviceId'
          element={<FunctionalServiceDetail />}
        />
        <Route path='/gpu-cloud' element={<GPUCloud />} />
        <Route path='/gpu-cloud/:cloudId' element={<CloudDeployment />} />
        <Route path='/deploy' element={<Deploy />} />
        <Route path='/deploy/:providerId' element={<Deploy />} />
        <Route path='/content-editor' element={<ContentEditorDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
