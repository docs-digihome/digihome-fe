import { Menu } from "@base-ui/react/menu"
import { Check, Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme, type Theme } from "@/components/theme/theme-provider"

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const ActiveIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Select theme, current ${theme}`}
          />
        }
      >
        <ActiveIcon className="size-4" />
        <span className="sr-only">Toggle theme</span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Backdrop className="fixed inset-0 z-40 bg-transparent" />
        <Menu.Positioner
          sideOffset={8}
          align="end"
          className="z-50 outline-none"
        >
          <Menu.Popup
            className={cn(
              "min-w-36 rounded-xl border bg-popover p-1 text-sm text-popover-foreground shadow-md",
              "origin-(--transform-origin) duration-100 outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            {options.map((opt) => {
              const Icon = opt.icon
              const isActive = theme === opt.value
              return (
                <Menu.Item
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none cursor-pointer",
                    "hover:bg-muted focus:bg-muted",
                    isActive && "bg-muted font-medium",
                  )}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isActive && <Check className="size-3.5 shrink-0" />}
                </Menu.Item>
              )
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
