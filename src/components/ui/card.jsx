import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, badge, ...props }, ref) => {
  // Determine badge styles based on the badge value
  const badgeStyles = {
    approved: "bg-green-50 text-green-700 ring-green-600/20",
    revoked: "bg-red-50 text-red-700 ring-red-600/20",
    paused: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    interested: "bg-blue-50 text-blue-700 ring-blue-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/20",
  };

  const badgeStyle = badgeStyles[badge];

  return (
    <div className={cn("flex items-center space-x-2")}>
      <h3
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
      {badgeStyle && (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            badgeStyle
          )}
        >
          {badge === 'interested' ? 'awaiting approval': badge}
        </span>
      )}
    </div>
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
