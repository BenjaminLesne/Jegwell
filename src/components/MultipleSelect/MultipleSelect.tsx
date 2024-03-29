import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

export type OptionType = {
  value: string;
  label: string;
  [key: string]: unknown;
};

export type MenuItemProps = {
  option: OptionType;
  selected: OptionType[];
};

interface MultiSelectProps {
  MenuItem: ({ option, selected }: MenuItemProps) => JSX.Element;
  options: OptionType[];
  selected: OptionType[];
  onChange: React.Dispatch<React.SetStateAction<OptionType[]>>;
  className?: string;
  placeholder?: string;
}
/*
short explanation: to make it compatible with any type of options we use object as options. As long as your options satisfies the OptionType, you should be good.
To make sure the data display itself as wanted, you have to pass a MenuItem component that will receive the option.
You don't need to change the type of anything.
A more detailed documentation should be done with docusaurus when the time allow me to
*/
const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ MenuItem, options, selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleUnselect = (item: OptionType) => {
      onChange(selected.filter((i) => i.value !== item.value));
    };

    // on delete key press, remove last selected item
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && selected.length > 0) {
          onChange(
            selected.filter((_, index) => index !== selected.length - 1)
          );
        }

        // close on escape
        if (e.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onChange, selected]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={className}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`group w-full justify-between ${
              selected.length > 1 ? "h-full" : "h-10"
            }`}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selected.map((item) => (
                <Badge
                  variant="outline"
                  key={item.value}
                  className="flex items-center gap-1 group-hover:bg-background"
                  onClick={() => handleUnselect(item)}
                >
                  {item.label}
                  <Button
                    asChild
                    variant="outline"
                    className="border-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </Button>
                </Badge>
              ))}
              {selected.length === 0 && (
                <span>{props.placeholder ?? "Select ..."}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className={className}>
            <CommandInput placeholder="Search ..." />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    onChange(
                      selected.some((item) => item.value === option.value)
                        ? selected.filter((item) => item.value !== option.value)
                        : [...selected, option]
                    );
                    setOpen(true);
                  }}
                >
                  <MenuItem option={option} selected={selected} />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
