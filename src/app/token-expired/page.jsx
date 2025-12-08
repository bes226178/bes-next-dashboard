import { ICCC_URL } from '@/config-global'
import { Alert, Button, Box, Typography } from '@mui/material'

export default function TokenExpired() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        padding: 3,
      }}
    >
      <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Token 已失效
        </Typography>
        <Typography variant="body1">
          您的存取權杖已過期，請重新取得有效的 token 後再試。
        </Typography>
      </Alert>

      <Button
        href={ICCC_URL}
        variant="contained"
        size="large"
        color="error"
      >
        返回 影音即時指揮中心 - 智慧決策平台
      </Button>
    </Box>
  )
}

