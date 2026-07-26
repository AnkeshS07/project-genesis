import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

describe('HomePage shell', () => {
  const original = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = original;
    }
  });

  it('should_show_ui_shell_online_message', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /Project Genesis UI shell is online/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Business REST APIs are served by NestJS/i)).toBeInTheDocument();
  });

  it('should_show_configured_api_base_url', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://api.test:4000';
    render(<HomePage />);

    expect(screen.getByText('http://api.test:4000')).toBeInTheDocument();
    expect(screen.getByText(/None \(Architecture 1\.1\)/i)).toBeInTheDocument();
  });
});
