'use client';

import * as React from 'react';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';
import { cn } from 'cn';

export interface FormFieldProps extends Omit<React.ComponentProps<typeof Field>, 'children'> {
  id?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | { title?: React.ReactNode; detail?: React.ReactNode; action?: React.ReactNode };
  errors?: Array<{ message?: string } | undefined>;
  required?: boolean;
  optional?: boolean;
  children: React.ReactElement<Record<string, unknown>>;
}

export function FormField({
  id: providedId,
  label,
  hint,
  error,
  errors,
  required = false,
  optional = false,
  className,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const childId =
    (children.props?.id as string | undefined) ?? providedId ?? `field-${generatedId}`;

  const hintId = `${childId}-hint`;
  const errorId = `${childId}-err`;

  const hasErrorObject =
    typeof error === 'object' && error !== null && Boolean(error.title || error.detail);
  const hasErrorString = typeof error === 'string' && error.trim().length > 0;
  const hasErrorsArray = Boolean(errors?.some((e) => Boolean(e?.message)));
  const isInvalid = hasErrorObject || hasErrorString || hasErrorsArray;

  const describedByIds = [
    hint ? hintId : null,
    isInvalid ? errorId : null,
    children.props?.['aria-describedby'] as string | undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const enhancedChild = React.cloneElement(children, {
    id: childId,
    'aria-invalid': isInvalid ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined,
    'aria-describedby': describedByIds.length > 0 ? describedByIds : undefined,
  });

  return (
    <Field data-invalid={isInvalid ? 'true' : undefined} className={cn(className)} {...props}>
      <div className={cn('flex items-center justify-between gap-2')}>
        <FieldLabel htmlFor={childId}>
          <span>{label}</span>
          {required && (
            <span aria-hidden="true" className={cn('text-primary')}>
              *
            </span>
          )}
        </FieldLabel>

        {optional && !required && (
          <span className={cn('font-mono text-xs text-muted-foreground')}>Optional</span>
        )}
      </div>

      {enhancedChild}

      {hint && <FieldDescription id={hintId}>{hint}</FieldDescription>}

      {isInvalid && (
        <FieldError
          id={errorId}
          title={hasErrorObject ? error.title : undefined}
          detail={hasErrorObject ? error.detail : undefined}
          action={hasErrorObject ? error.action : undefined}
          errors={hasErrorString ? [{ message: error }] : errors}
        />
      )}
    </Field>
  );
}

export default FormField;
