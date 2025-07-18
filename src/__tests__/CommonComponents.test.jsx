import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonLoader, EmptyState, RadialProgress } from '../components/ui/CommonComponents';
import { Home } from 'lucide-react';

describe('CommonComponents', () => {
  describe('SkeletonLoader', () => {
    it('renders skeleton cards', () => {
      render(<SkeletonLoader />);
      const skeletonElement = document.querySelector('.animate-pulse');
      expect(skeletonElement).toBeTruthy();
    });
  });

  describe('EmptyState', () => {
    it('renders with all props', () => {
      const mockAction = <button>Test Action</button>;
      render(
        <EmptyState
          icon={Home}
          title="Test Title"
          description="Test Description"
          action={mockAction}
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
    });
  });

  describe('RadialProgress', () => {
    it('renders progress circle with children', () => {
      render(
        <RadialProgress value={75} max={100}>
          <span>75%</span>
        </RadialProgress>
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
      // Check if SVG is rendered
      const svg = document.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });
});
