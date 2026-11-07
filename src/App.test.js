import { render, screen } from '@testing-library/react';
import App from './App';

// Test 1: Check karte hain ke main heading render ho rahi hai ya nahi
test('renders the main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Smart AI Article Summarizer/i);
  expect(headingElement).toBeInTheDocument();
});

// Test 2: Check karte hain ke button render ho raha hai ya nahi
test('renders the summarize button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Summarize Now/i });
  expect(buttonElement).toBeInTheDocument();
});