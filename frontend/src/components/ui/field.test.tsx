import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { FieldError } from '@/components/ui/field';
import { renderWithProviders } from '@tests/utils/render';

describe('FieldError', () => {
  it('no message -> renders nothing', () => {
    const { container } = renderWithProviders(<FieldError />);
    expect(container).toBeEmptyDOMElement();

    const { container: emptyArrayContainer } = renderWithProviders(<FieldError errors={[]} />);
    expect(emptyArrayContainer).toBeEmptyDOMElement();
  });

  it('title + detail -> both visible, title in bold', () => {
    const { getByText } = renderWithProviders(
      <FieldError
        title="Too weak."
        detail="Use at least 12 characters, including a number and a symbol."
      />,
    );

    const titleEl = getByText('Too weak.');
    const detailEl = getByText(/use at least 12 characters, including a number and a symbol\./i);

    expect(titleEl).toBeVisible();
    expect(detailEl).toBeVisible();
    expect(titleEl.tagName).toBe('STRONG');
  });

  it('does not have role="alert"', () => {
    const { queryByRole } = renderWithProviders(
      <FieldError errors={[{ message: "Passwords don't match." }]} />,
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });
});
