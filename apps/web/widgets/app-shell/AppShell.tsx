interface AppShellProps {
  children: React.ReactNode
  showNav?: boolean
}

export function AppShell({ children, showNav = false }: AppShellProps) {
  return (
    <div className="mx-auto max-w-[448px] min-h-screen relative bg-page">
      <main className={showNav ? 'pb-16' : ''}>{children}</main>
    </div>
  )
}
