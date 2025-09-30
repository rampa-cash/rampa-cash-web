import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../components/ThemeToggle';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const renderThemeToggle = (component: React.ReactElement) => {
    return render(component);
};

describe('ThemeToggle', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockReturnValue(null);
        localStorageMock.setItem.mockClear();
    });

    it('renders theme toggle button', async () => {
        renderThemeToggle(<ThemeToggle />);

        // Wait for component to mount
        await new Promise(resolve => setTimeout(resolve, 100));

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('toggles theme when clicked', async () => {
        renderThemeToggle(<ThemeToggle />);

        // Wait for component to mount
        await new Promise(resolve => setTimeout(resolve, 100));

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('shows correct icon based on theme', async () => {
        renderThemeToggle(<ThemeToggle />);

        // Wait for component to mount
        await new Promise(resolve => setTimeout(resolve, 100));

        // Should show moon icon for light theme
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
