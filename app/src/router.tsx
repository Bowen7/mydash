import { Routes, Route } from 'react-router-dom';
import { Home } from '@/views/home';
import { Root } from '@/views/root';
import { Project } from '@/views/project';

export const router = (
  <Routes>
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="project/:pkey" element={<Project />} />
    </Route>
  </Routes>
);
