import Link from "next/link";
import TeamSwitcher from "./team-switcher";
import { Configuration } from "./config-ui";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
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
            className="text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            Prompts
          </Link>
          <Link
            href="/users"
            className="text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            Users
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
         <Configuration />
        </div>
      </div>
    </div>
  );
}
