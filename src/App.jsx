import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Browse, Login, Watch } from '@/page';

function App() {
  useEffect(() => {
    document.title = 'J MOVIE';
  }, []);
  return (
    <div className="App">
      <div>
        {/* 페이지 이동처리 */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Browse" element={<Browse />} />
          <Route path="/watch/:movieId/:movieSeq/:movieVal" element={<Watch />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
