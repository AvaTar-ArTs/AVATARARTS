export default {
  logo: <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>AVATARARTS</span>,
  project: {
    link: 'https://github.com/AvaTar-ArTs'
  },
  docsRepositoryBase: 'https://github.com/AvaTar-ArTs/avatararts',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – AVATARARTS'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="AVATARARTS" />
      <meta property="og:description" content="Multi-Revenue Stream Digital Business Automation Platform" />
    </>
  ),
  primaryHue: 205, // Blue hue for AVATARARTS brand
  darkMode: true,
  navigation: {
    prev: true,
    next: true
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} ©{' '}
        <a href="https://avatar-arts.github.io" target="_blank">
          AVATARARTS
        </a>
        . Built with Nextra.
      </span>
    )
  }
}
