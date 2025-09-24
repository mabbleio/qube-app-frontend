import close_svg from '@material-design-icons/svg/filled/close.svg'
import { ReactNode, useEffect, useState } from 'react'
import { Logo } from '../icons/Logo'
import classes from './index.module.css'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AppStateContextProvider } from '../../providers/SidebarStateProvider'
import { useSidebarState } from '../../hooks/useSidebarState'

interface Props {
  navItem?: ReactNode
}

export function SidebarCmp({ navItem }: Props) {
  const location = useLocation()
  const {
    state: { isOpen },
    setIsOpen,
  } = useSidebarState()

  // --- NEW: submenu state for "Wrap"
  const isOnWrap = location.pathname === '/wtics' || location.pathname === '/xqst'
  const [wrapOpen, setWrapOpen] = useState<boolean>(isOnWrap)

  useEffect(() => {
    // auto-close the mobile sidebar when route changes
    if (isOpen) setIsOpen(false)
    // keep submenu open whenever we're on any /wrap* route
    setWrapOpen(isOnWrap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <div className={classes.sidebarLayout}>
      <input
        type="checkbox"
        id="sidebarCheckbox"
        className={classes.sidebarCheckbox}
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <nav className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <NavLink to="/" className={classes.logo}>
            <Logo />
          </NavLink>
          <label title="Hide sidebar" className={classes.mobileSidebarClose} htmlFor="sidebarCheckbox">
            <img src={close_svg} alt="Hide sidebar" width="20" />
          </label>
        </div>
        <hr />

        <div className={classes.linksWrapper}>
          <div className={classes.links}>
            <NavLink to="/discover" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
              Discover
            </NavLink>

            {/* --- REPLACED: Wrap link -> toggleable submenu */}
            <div className={classes.menuGroup}>
              <button
                type="button"
                className={`${classes.menuButton} ${wrapOpen ? classes.menuButtonOpen : ''} ${isOnWrap ? classes.activeLink : ''
                  }`}
                aria-expanded={wrapOpen}
                aria-controls="wrap-submenu"
                onClick={() => setWrapOpen((v) => !v)}
              >
                <span>Wrap / Unwrap</span>
                <span className={classes.caret} aria-hidden="true">▾</span>
              </button>

              <div
                id="wrap-submenu"
                className={`${classes.submenu} ${wrapOpen ? classes.submenuOpen : ''}`}
                role="group"
                aria-label="Wrap submenu"
              >
                <NavLink
                  to="/wtics"
                  className={({ isActive }) =>
                    `${classes.submenuLink} ${isActive ? classes.activeSubmenuLink : ''}`
                  }
                >
                  WTICS
                </NavLink>

                <NavLink
                  to="/xqst"
                  className={({ isActive }) =>
                    `${classes.submenuLink} ${isActive ? classes.activeSubmenuLink : ''}`
                  }
                >
                  XQST
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {navItem}

        <a
          className={classes.privacyPolicy}
          href={PRIVACY_POLICY_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy policy
        </a>
      </nav>
      <div className={classes.main}>
        <Outlet />
      </div>
      <label className={classes.backdrop} htmlFor="sidebarCheckbox"></label>
    </div>
  )
}

export function Sidebar(props: Props) {
  return (
    <AppStateContextProvider>
      <SidebarCmp {...props} />
    </AppStateContextProvider>
  )
}
