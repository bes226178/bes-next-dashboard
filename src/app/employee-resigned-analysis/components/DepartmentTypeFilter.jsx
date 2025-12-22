'use client'

import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material'

export default function DepartmentTypeFilter({ value, onChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: '#1e293b',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          mr: 0.5,
        }}
      >
        部門類型:
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(event, newValue) => {
          if (newValue !== null) {
            onChange(newValue)
          }
        }}
        aria-label="部門類型篩選"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: { xs: 2.5, sm: 3 },
            py: 1,
            fontSize: '14px',
            fontWeight: 600,
            color: '#64748b',
            border: '1.5px solid rgba(102, 126, 234, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
              borderColor: 'rgba(102, 126, 234, 0.4)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(102, 126, 234, 0.15)',
              color: '#667eea',
              borderColor: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
              },
            },
          },
        }}
      >
        <ToggleButton value="all" aria-label="全部">
          全部
        </ToggleButton>
        <ToggleButton value="總公司" aria-label="總公司">
          總公司
        </ToggleButton>
        <ToggleButton value="工務所" aria-label="工務所">
          工務所
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
