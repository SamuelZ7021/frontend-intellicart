import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('renders with correct text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        expect(container.firstChild).toHaveClass('bg-destructive text-destructive-foreground hover:bg-destructive/90');
    });
});
