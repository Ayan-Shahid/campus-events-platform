import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { FieldError } from '@/components/ui/field';
import { renderWithProviders } from '@tests/utils/render';
import { render, screen } from '@testing-library/react';

describe('FieldError', () => {
  it('no message -> renders nothing', () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();

    const { container: emptyArrayContainer } = render(<FieldError errors={[]} />);
    expect(emptyArrayContainer).toBeEmptyDOMElement();
  });

  it('title + detail -> both visible, title in bold', () => {
    renderWithProviders(
      <FieldError
        title="Too weak."
        detail="Use at least 12 characters, including a number and a symbol."
      />,
    );

    const titleEl = screen.getByText('Too weak.');
    const detailEl = screen.getByText(
      /use at least 12 characters, including a number and a symbol\./i,
    );

    expect(titleEl).toBeVisible();
    expect(detailEl).toBeVisible();
    expect(titleEl.tagName).toBe('STRONG');
  });

  it('does not have role="alert"', () => {
    renderWithProviders(<FieldError errors={[{ message: "Passwords don't match." }]} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
