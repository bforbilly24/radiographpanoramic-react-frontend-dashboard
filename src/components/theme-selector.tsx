"use client";

import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'Zinc', value: 'zinc' },
  { name: 'Red', value: 'red' },
  { name: 'Rose', value: 'rose' },
  { name: 'Orange', value: 'orange' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Violet', value: 'violet' },
];

export function ThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={colorTheme || ''} onValueChange={setColorTheme}>
        <SelectTrigger
          id="theme-selector"
          className="h-8 w-fit rounded-lg justify-start"
        >
          <span className="text-muted-foreground hidden sm:block">
            Select a theme:
          </span>
          <span className="text-muted-foreground block sm:hidden">Theme</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end" className="w-fit rounded-lg">
          <SelectGroup>
            <SelectLabel>Colors</SelectLabel>
            {themes.map((theme) => (
              <SelectItem
                key={theme.value}
                value={theme.value}
                className={cn('text-sm', colorTheme === theme.value && 'bg-muted')}
              >
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}