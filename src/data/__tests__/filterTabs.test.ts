import { describe, it, expect } from 'vitest';
import { generateFilterTabs, mockProducts } from '../mockData';
import type { Product } from '../mockData';

describe('Filter Tabs Data Logic', () => {
  it('generates correct filter tabs with exact labels', () => {
    const filters = generateFilterTabs(mockProducts);
    
    const expectedLabels = ['All Products', 'SFA', 'eB2B', 'DMS', 'AI', 'Management', 'Analytics', 'Studio'];
    const actualLabels = filters.map(f => f.label);
    
    expect(actualLabels).toEqual(expectedLabels);
  });

  it('calculates correct counts for each category', () => {
    const filters = generateFilterTabs(mockProducts);
    
    // Expected counts based on current mock data
    const expectedCounts = {
      'All Products': 8,
      'SFA': 1,
      'eB2B': 1, 
      'DMS': 1,
      'AI': 3,
      'Management': 2,
      'Analytics': 1,
      'Studio': 1
    };

    filters.forEach(filter => {
      expect(filter.count).toBe(expectedCounts[filter.label as keyof typeof expectedCounts]);
    });
  });

  it('handles empty product list', () => {
    const emptyProducts: Product[] = [];
    const filters = generateFilterTabs(emptyProducts);
    
    // All counts should be 0
    filters.forEach(filter => {
      expect(filter.count).toBe(0);
    });
  });

  it('correctly categorizes products', () => {
    // Test that products are correctly categorized
    const sfaProducts = mockProducts.filter(p => p.category === 'SFA');
    const aiProducts = mockProducts.filter(p => p.category === 'AI');
    const managementProducts = mockProducts.filter(p => p.category === 'Management');
    
    expect(sfaProducts).toHaveLength(1);
    expect(sfaProducts[0].title).toBe('NextGen SFA');
    
    expect(aiProducts).toHaveLength(3);
    expect(aiProducts.map(p => p.title)).toContain('SCAI - AI Agent');
    expect(aiProducts.map(p => p.title)).toContain('AI promo co-pilot');
    
    expect(managementProducts).toHaveLength(2);
    expect(managementProducts.map(p => p.title)).toContain('NextGen DMS');
    expect(managementProducts.map(p => p.title)).toContain('Supervisor');
  });

  it('maintains filter order as specified', () => {
    const filters = generateFilterTabs(mockProducts);
    const expectedOrder = ['All Products', 'SFA', 'eB2B', 'DMS', 'AI', 'Management', 'Analytics', 'Studio'];
    
    const actualOrder = filters.map(f => f.label);
    expect(actualOrder).toEqual(expectedOrder);
  });
});