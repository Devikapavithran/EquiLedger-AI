import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  FileText, 
  Settings,
  ShieldCheck,
  LogOut,
  ChevronUp,
  User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from '../types';
import { authService } from '../services/authService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  user: User | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users, path: '/stakeholders' },
  { id: 'captable', label: 'Cap Table', icon: PieChart, path: '/captable' },
  { id: 'funding', label: 'Funding Rounds', icon: TrendingUp, path: '/funding' },
  { id: 'vesting', label: 'Vesting', icon: Clock, path: '/vesting' },
  { id: 'ai', label: 'AI Assistant', icon: MessageSquare, path: '/ai' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMenuAction = (path: string) => {
    setIsMenuOpen(false);
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-accent transition-transform duration-300 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-sidebar-primary rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">EquiLedger AI</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-white" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-accent">
          <div className="relative" ref={menuRef}>
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
                isMenuOpen ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.role || 'Founder'}</p>
              </div>
              <ChevronUp 
                size={16} 
                className={cn(
                  "text-sidebar-foreground/60 transition-transform duration-200",
                  isMenuOpen ? "rotate-180" : ""
                )} 
              />
            </div>

            {isMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-sidebar-accent rounded-xl shadow-2xl border border-sidebar-primary/20 p-2 overflow-hidden">
                  <button
                    onClick={() => handleMenuAction('/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-primary hover:text-white transition-all text-sm font-medium"
                  >
                    <UserIcon size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => handleMenuAction('/settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-primary hover:text-white transition-all text-sm font-medium"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <div className="my-1 border-t border-sidebar-primary/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 transition-all text-sm font-bold"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};