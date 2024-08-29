"use client";
import Link from "next/link";
import TeamSwitcher from "./team-switcher";
import { Configuration } from "./config-ui";
import { usePathname } from "next/navigation";
import { cx } from "class-variance-authority";

export type MainNavProps = {
  defaultUserCount: number;
  defaultPromptCount: number;
  defaultMaliciousPromptRate: number;
} & React.HTMLAttributes<HTMLElement>;

export function MainNav({
  defaultUserCount,
  defaultPromptCount,
  defaultMaliciousPromptRate,
  className,
  ...props
}: MainNavProps) {
  const path = usePathname();

  const linkStyles = cx(
    "text-sm font-medium text-muted transition-colors hover:text-primary",
    "data-[selected=true]:text-primary data-[selected=true]:font-semibold"
  );

  return (
    <div className="border-b flex h-16 items-center">
      <div className="flex justify-between w-full max-w-screen-xl mx-auto px-4">
        <TeamSwitcher />
        <nav
          className={"flex items-center space-x-4 lg:space-x-6 mx-6"}
          {...props}
        >
          <Link
            href="/prompts"
            data-selected={path === "/prompts" ? true : undefined}
            className={linkStyles}
          >
            Prompts
          </Link>
          <Link
            href="/users"
            className={linkStyles}
            data-selected={path === "/users" ? true : undefined}
          >
            Users
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Configuration
            defaultUserCount={defaultUserCount}
            defaultPromptCount={defaultPromptCount}
            defaultMaliciousPromptRate={defaultMaliciousPromptRate}
          />
        </div>
      </div>
    </div>
  );
}
