import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileCard } from '../profile-card';
import { UserProfile } from '../../types';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockProfile: UserProfile = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  bio: 'Software developer',
  avatar: undefined,
  location: 'San Francisco',
  website: 'https://johndoe.com',
  skills: ['React', 'TypeScript', 'Node.js'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-01'),
};

describe('ProfileCard', () => {
  it('renders profile name and email', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders initials when no avatar', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders avatar image when provided', () => {
    const profileWithAvatar = {
      ...mockProfile,
      avatar: 'https://example.com/avatar.jpg',
    };
    render(<ProfileCard profile={profileWithAvatar} />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders bio when provided', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('Software developer')).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
  });

  it('renders website link', () => {
    render(<ProfileCard profile={mockProfile} />);
    const link = screen.getByRole('link', { name: /johndoe\.com/i });
    expect(link).toHaveAttribute('href', 'https://johndoe.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders skills', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('hides optional sections when not provided', () => {
    const minimalProfile: UserProfile = {
      id: '2',
      email: 'jane@test.com',
      name: 'Jane',
      skills: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    render(<ProfileCard profile={minimalProfile} />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
    expect(screen.queryByText('Location')).not.toBeInTheDocument();
    expect(screen.queryByText('Website')).not.toBeInTheDocument();
    expect(screen.queryByText('Skills')).not.toBeInTheDocument();
  });
});
