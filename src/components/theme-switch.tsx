"use client";

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

export function ThemeSwitch() {
  const { mode, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-lg">
        <DropdownMenuItem
          onClick={() => setMode('light')}
          className={cn('text-sm', mode === 'light' && 'bg-muted')}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setMode('dark')}
          className={cn('text-sm', mode === 'dark' && 'bg-muted')}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setMode('system')}
          className={cn('text-sm', mode === 'system' && 'bg-muted')}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}