import Amplify from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentTests from './ComponentTests';
import GenerateTests from './GenerateTests';
import PrimitivesTests from './PrimitivesTests';
import ComplexTests from './ComplexTests';
import IconsetTests from './IconsetTests';

// use fake endpoint so useDataStoreBinding does not fail
Amplify.configure({
  aws_appsync_graphqlEndpoint: 'https://fake-appsync-endpoint/graphql',
});

const HomePage = () => {
  return (
    <div>
      <h1>Codegen UI Functional Tests</h1>
      <ul>
        <li>
          <a href="/component-tests">Component Tests</a>
        </li>
        <li>
          <a href="/generate-tests">Browser Generation Tests</a>
        </li>
        <li>
          <a href="/primitives-tests">Primitives Tests</a>
        </li>
        <li>
          <a href="/complex-tests">Complex Tests</a>
        </li>
        <li>
          <a href="/iconset-tests">Iconset Tests</a>
        </li>
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/component-tests" element={<ComponentTests />} />
        <Route path="/generate-tests" element={<GenerateTests />} />
        <Route path="/primitives-tests" element={<PrimitivesTests />} />
        <Route path="/complex-tests" element={<ComplexTests />} />
        <Route path="/iconset-tests" element={<IconsetTests />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
