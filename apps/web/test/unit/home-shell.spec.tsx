import { render, screen } from '@testing-library/react';
import HomePage from '../../app/(marketing)/page';

describe('HomePage shell', () => {
  it('should_show_authentication_ready_message', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /Project Genesis authentication is ready/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create account/i })).toBeInTheDocument();
  });
});
