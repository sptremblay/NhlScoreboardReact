import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NHL scoreboard loading state', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading nhl games/i);
  expect(loadingElement).toBeInTheDocument();
});
