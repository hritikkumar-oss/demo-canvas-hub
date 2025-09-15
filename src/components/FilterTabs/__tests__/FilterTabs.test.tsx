import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FilterTabs from '../FilterTabs';

describe('FilterTabs', () => {
  const mockFilters = [
    { id: 'all', label: 'All Products', count: 8 },
    { id: 'sfa', label: 'SFA', count: 1 },
    { id: 'eb2b', label: 'eB2B', count: 1 },
    { id: 'dms', label: 'DMS', count: 1 },
    { id: 'ai', label: 'AI', count: 3 },
    { id: 'management', label: 'Management', count: 2 },
    { id: 'analytics', label: 'Analytics', count: 1 },
    { id: 'studio', label: 'Studio', count: 1 }
  ];

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter tabs with labels and counts', () => {
    const { container } = render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilters}
      />
    );

    // Check that all required labels are present in buttons
    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const buttonTexts = Array.from(buttons).map(b => b.textContent);
    
    expect(buttonTexts.some(text => text?.includes('All Products'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('SFA'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('eB2B'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('DMS'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('AI'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('Management'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('Analytics'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('Studio'))).toBe(true);

    // Check that counts are displayed
    expect(buttonTexts.some(text => text?.includes('8'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('3'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('2'))).toBe(true);
  });

  it('shows correct active filter with proper styling', () => {
    const { container } = render(
      <FilterTabs
        activeFilter="ai"
        onFilterChange={mockOnFilterChange}
        filters={mockFilters}
      />
    );

    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const aiButton = Array.from(buttons).find(b => b.textContent?.includes('AI'));
    expect(aiButton).toHaveAttribute('aria-pressed', 'true');
    expect(aiButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onFilterChange when filter tab is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilters}
      />
    );

    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const sfaButton = Array.from(buttons).find(b => b.textContent?.includes('SFA'));
    
    if (sfaButton) {
      await user.click(sfaButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith('sfa');
    }
  });

  it('toggles filter when active filter is clicked again', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FilterTabs
        activeFilter="ai"
        onFilterChange={mockOnFilterChange}
        filters={mockFilters}
      />
    );

    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const aiButton = Array.from(buttons).find(b => b.textContent?.includes('AI'));
    
    if (aiButton) {
      await user.click(aiButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    }
  });

  it('handles filters with zero count', () => {
    const filtersWithZero = [
      ...mockFilters,
      { id: 'empty', label: 'Empty Category', count: 0 }
    ];

    const { container } = render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={filtersWithZero}
      />
    );

    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const buttonTexts = Array.from(buttons).map(b => b.textContent);
    
    expect(buttonTexts.some(text => text?.includes('Empty Category'))).toBe(true);
    expect(buttonTexts.some(text => text?.includes('0'))).toBe(true);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilters}
      />
    );

    const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const firstButton = buttons[0];
    
    if (firstButton) {
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Test keyboard navigation
      await user.keyboard('{Enter}');
      expect(mockOnFilterChange).toHaveBeenCalled();
    }
  });
});