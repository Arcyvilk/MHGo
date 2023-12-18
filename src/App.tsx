import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import s from './App.module.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <div className={s.app}>
      <BrowserRouter>
        <div className={s.app__top}>
          <Header />
          <Navigation />
        </div>
        <Routes>
          <Route path="/" element={<HomeView />} />
        </Routes>
      </BrowserRouter>
    </div>
    </QueryClientProvider>
  )
}

const Header = () => {
  return <div>Header</div>
}
const Navigation = () => {
  return <div>Navigation</div>
}
const HomeView = () => {
  return <div>HomeView</div>
}