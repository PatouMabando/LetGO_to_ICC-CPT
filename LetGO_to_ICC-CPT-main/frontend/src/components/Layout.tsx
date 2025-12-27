import { CssBaseline, GlobalStyles } from '@mui/joy';
import { Box } from '@mui/joy';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <CssBaseline />
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: 'var(--joy-palette-background-body)',
        },
      }}
    />
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  </>
);