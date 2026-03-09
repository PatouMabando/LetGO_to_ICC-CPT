import { Box, Typography, Button } from '@mui/joy';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AddAlertOutlined, HomeOutlined } from '@mui/icons-material';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  let title = t('error.page.unexpected.title');
  let message = t('error.page.unexpected.description');

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = t('error.page.notFound.title');
      message = t('error.page.notFound.description');
    } else {
      message = error.statusText;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <AddAlertOutlined />
      <Typography level="h4" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 3, maxWidth: 500 }}>
        {message}
      </Typography>
      <Button
        variant="solid"
        color="primary"
        startDecorator={<HomeOutlined />}
        onClick={() => navigate('/')}
      >
        {t('error.page.actions.home')}
      </Button>
    </Box>
  );
}