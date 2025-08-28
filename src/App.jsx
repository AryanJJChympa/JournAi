import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Chatbot from './components/Chatbot';

const App = () => {
  return (
    <div className='w-full min-h-screen bg-gradient-to-r from-neutral-900 to-neutral-800'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chatbot />} />
      </Routes>
    </div>
  );
};

export default App;
