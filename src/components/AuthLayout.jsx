import React from "react";

export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-sm">
            {Icon && (
              <Icon
                className="h-8 w-8 text-primary-foreground"
                aria-hidden="true"
              />
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {subtitle && (
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Authentication Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <p className="mt-6 px-4 text-center text-sm leading-5 text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
