import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';
import { renderWithProviders } from '@tests/utils/render';
import { checkA11y } from '@tests/utils/a11y';

describe('FormField', () => {
  it('the input is found via getByLabelText("Student ID")', () => {
    const { getByLabelText } = renderWithProviders(
      <FormField label="Student ID">
        <Input />
      </FormField>,
    );

    expect(getByLabelText(/student id/i)).toBeInTheDocument();
  });

  it('with a hint and no error: aria-describedby points at the hint, and aria-invalid is absent', () => {
    const { getByLabelText } = renderWithProviders(
      <FormField label="Student ID" hint="Printed on your university card.">
        <Input />
      </FormField>,
    );

    const input = getByLabelText(/student id/i);
    expect(input).toHaveAccessibleDescription('Printed on your university card.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('with an error: aria-invalid="true", and the input’s accessible description includes the error text', () => {
    const { getByLabelText } = renderWithProviders(
      <FormField
        label="Student ID"
        hint="Printed on your university card."
        error="Student ID format isn't recognised. Use RMU-2026-00336."
      >
        <Input />
      </FormField>,
    );

    const input = getByLabelText(/student id/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      /student id format isn't recognised\. use rmu-2026-00336\./i,
    );
  });

  it('required: the input has aria-required', () => {
    const { getByLabelText } = renderWithProviders(
      <FormField label="Student ID" required>
        <Input />
      </FormField>,
    );

    const input = getByLabelText(/student id/i);
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('axe: zero violations, both with and without an error', async () => {
    const { container: validContainer } = renderWithProviders(
      <FormField label="Student ID" hint="Printed on your university card.">
        <Input />
      </FormField>,
    );
    await checkA11y(validContainer);

    const { container: invalidContainer } = renderWithProviders(
      <FormField
        label="Student ID"
        hint="Printed on your university card."
        error="Format not recognised."
        required
      >
        <Input />
      </FormField>,
    );
    await checkA11y(invalidContainer);
  });
});
