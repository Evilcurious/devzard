import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap, ArrowUpRight, ChevronDown, User, LogOut, LayoutDashboard, KeyRound, Sun, Moon, Crown } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, Languages, Building2 } from "lucide-react";
import { cn } from "../utils/cn";

type NavItem = { label: string; href: string; children?: { label: string; href: string; desc: string }[] };

const links: NavItem[] = [
  {
    label: "Staff Portal",
    href: "/staff",
  },
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Website Development", href: "/services/website-development", desc: "Sites & stores that convert" },
      { label: "App Development", href: "/services/app-development", desc: "iOS & Android apps" },
      { label: "Meta Ads", href: "/services/meta-ads", desc: "Facebook & Instagram" },
      { label: "Google Ads", href: "/services/google-ads", desc: "Search, Display, PMax" },
      { label: "TikTok Ads", href: "/services/tiktok-ads", desc: "Viral-first ad creative" },
      { label: "Video Editing", href: "/services/video-editing", desc: "Reels, Shorts, ads" },
      { label: "YouTube Branding", href: "/services/youtube-branding", desc: "Logos, banners, thumbnails" },
      { label: "Social Management", href: "/services/social-management", desc: "Full account growth" },
      { label: "AI Marketing", href: "/services/ai-marketing", desc: "Automation & agents" },
      { label: "Digital Marketing 360°", href: "/services/digital-marketing", desc: "Integrated strategy" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Blazing Servers", href: "/products/servers", desc: "Hosting & dedicated" },
      { label: "Website Templates", href: "/products/templates", desc: "Premium ready-to-launch" },
      { label: "Brand Kits", href: "/products/brand-kits", desc: "Logos, banners, thumbnails" },
      { label: "AI Marketing Suite", href: "/products/ai-suite", desc: "Automation that scales" },
    ],
  },
  { label: "Process", href: "/process" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, siteMode, toggleSiteMode } = useStore();
  const { lang, toggleLang } = useLanguage();

  const ThemeToggle = ({
    compact = false,
    darkSurface = false,
  }: {
    compact?: boolean;
    darkSurface?: boolean;
  }) => (
    <button
      onClick={toggleSiteMode}
      aria-label={siteMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border shadow-sm transition-all",
        darkSurface
          ? "border-white/15 bg-white/10 text-white hover:border-sky-400/50 hover:bg-white/15"
          : "border-brand-100 bg-white/80 text-slate-700 hover:border-brand-300 hover:text-brand-600",
        compact ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-sm"
      )}
    >
      {siteMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className={compact ? "hidden sm:inline" : ""}>{siteMode === "dark" ? "Light" : "Dark"}</span>
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // close user menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            "relative z-20 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6",
            scrolled
              ? "glass-card shadow-lg shadow-brand-600/5"
              : "border border-transparent bg-transparent"
          )}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            {theme.logoImageUrl ? (
              <img
                src={theme.logoImageUrl}
                alt={theme.siteName + theme.siteNameAccent}
                className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:rotate-6"
              />
            ) : (
              <span className={cn("relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:rotate-6", theme.logoGradient)}>
                {theme.logoIcon}
              </span>
            )}
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              {theme.siteName}
              <span className="text-brand-600 dark:text-sky-400">{theme.siteNameAccent}</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink
                    to={link.href}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-brand-600" : "text-slate-600 hover:text-brand-600"
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                    {!link.children && (
                      <span
                        className={cn(
                          "absolute inset-x-4 bottom-1 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-600 to-sky-400 transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    )}
                  </NavLink>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 mt-2 -translate-x-1/2"
                      >
                        <div
                          className={cn(
                            "glass-card w-[480px] rounded-2xl p-3 shadow-2xl shadow-brand-900/10",
                            link.label === "Services" ? "grid grid-cols-2 gap-1" : "flex flex-col"
                          )}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="group/item flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-brand-50"
                            >
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 group-hover/item:text-brand-600">
                                {child.label}
                                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/item:opacity-100" />
                              </span>
                              <span className="text-xs text-slate-500">{child.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Desktop auth + CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <button onClick={toggleLang} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50"><Languages className="h-3.5 w-3.5" /> {lang==="en" ? "EN / اردو" : "اردو / EN"}</button>
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 rounded-full border border-brand-100 bg-white py-1.5 pr-4 pl-1.5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                      user.avatarColor
                    )}
                  >
                    {user.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", userMenuOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="glass-card absolute top-full right-0 mt-2 w-64 rounded-2xl p-2 shadow-2xl shadow-brand-900/10"
                    >
                      <div className="border-b border-brand-50 px-4 py-3">
                        <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-sky-400 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                          <Zap className="h-2.5 w-2.5" fill="currentColor" /> {user.plan}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <Link
                          to="/account"
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                        <Link
                          to="/staff"
                          className="flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                        >
                          <Building2 className="h-4 w-4" /> Staff Portal
                        </Link>
                        {(user.role === "admin" || user.role === "creator" || user.email === "evilcurious6@gmail.com") && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                          >
                            <ShieldCheck className="h-4 w-4" /> Site Admin
                          </Link>
                        )}
                        {["creator","admin","it_ceo","bd_ceo","hr"].includes(user.role) && (
                          <Link
                            to="/staff/admin"
                            className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
                          >
                            <Crown className="h-4 w-4" /> Staff Admin
                          </Link>
                        )}
                        <Link
                          to="/reset-password"
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <KeyRound className="h-4 w-4" /> Reset password
                        </Link>
                      </div>
                      <div className="mt-2 border-t border-brand-50 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:text-brand-600"
              >
                Sign in
              </Link>
            )}

            <Link
              to={user ? "/contact" : "/register"}
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:shadow-xl hover:shadow-brand-500/40"
            >
              {user ? "Get a Quote" : "Get started"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "relative z-20 flex h-10 w-10 items-center justify-center rounded-xl border transition-all lg:hidden",
              open
                ? "border-white/15 bg-navy-950 text-white shadow-lg"
                : "border-brand-100 bg-white text-slate-700"
            )}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-10 bg-navy-950/70 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative z-20 mt-2 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/10 bg-navy-950 p-3 shadow-2xl shadow-black/40 lg:hidden"
              >
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-sky-300",
                        location.pathname === link.href && "bg-white/10 text-sky-300"
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 text-sky-400" />
                    </Link>
                    {link.children && (
                      <ul className="mb-2 ml-4 space-y-1 border-l-2 border-white/15 pl-3">
                        {link.children.slice(0, 5).map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-white/10 hover:text-sky-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            to={link.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-xs font-semibold text-sky-300 transition-colors hover:bg-white/10"
                          >
                            View all →
                          </Link>
                        </li>
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>

              {/* mobile theme + auth section */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span className="text-xs font-semibold text-slate-300">Appearance</span>
                <ThemeToggle compact darkSurface />
              </div>
              {user ? (
                <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                        user.avatarColor
                      )}
                    >
                      {user.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{user.name}</p>
                      <p className="truncate text-xs text-slate-300">{user.email}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-gradient-to-r from-brand-600 to-sky-400 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      {user.plan}
                    </span>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-sky-300"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  {(user.role === "admin" || user.email === "evilcurious6@gmail.com") && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl bg-violet-500/15 px-4 py-3 text-sm font-semibold text-violet-200 transition-colors hover:bg-violet-500/25"
                    >
                      <ShieldCheck className="h-4 w-4" /> Admin panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-sky-400/50 hover:bg-white/15"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30"
                  >
                    Get started <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
