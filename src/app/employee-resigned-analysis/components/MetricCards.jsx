'use client'

import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { People, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material'

export default function MetricCards({ statistics }) {
  if (!statistics) {
    return null
  }

  const cards = [
    {
      title: '總離職人數',
      value: statistics.totalCount,
      unit: '人',
      icon: <People />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderColor: 'rgba(102, 126, 234, 0.2)',
    },
    {
      title: '平均服務年資',
      value: statistics.averageTenure,
      unit: '年',
      icon: <Assessment />,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      bgColor: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.2)',
    },
    {
      title: '最高服務年資',
      value: statistics.maxTenure,
      unit: '年',
      icon: <TrendingUp />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      bgColor: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    {
      title: '最低服務年資',
      value: statistics.minTenure,
      unit: '年',
      icon: <TrendingDown />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgColor: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
  ]

  return (
    <Box sx={{ mb: 0 }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: card.bgColor,
                border: `1px solid ${card.borderColor}`,
                height: '100%',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${card.borderColor}`,
                  borderColor: card.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: card.gradient,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 4px 12px ${card.borderColor}`,
                      '& svg': { fontSize: '24px' },
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#475569',
                      fontSize: '14px',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1.2,
                      fontSize: '32px',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {typeof card.value === 'number'
                      ? card.value.toLocaleString('zh-TW')
                      : card.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '16px',
                      ml: 0.5,
                    }}
                  >
                    {card.unit}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
