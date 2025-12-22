'use client'

import { Box, Typography, Slider } from '@mui/material'

export default function StartYearFilter({ value, onChange, minYear, maxYear }) {
  const handleChange = (event, newValue) => {
    onChange(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: { xs: 2, sm: 2.5 },
        width: '100%',
        maxWidth: { xs: '100%', sm: '500px', lg: '600px' },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: '#1e293b',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minWidth: { xs: '80px', sm: '90px' },
        }}
      >
        入職年份
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={minYear}
          max={maxYear}
          step={1}
          marks={[
            { value: minYear, label: `${minYear}` },
            { value: maxYear, label: `${maxYear}` },
          ]}
          sx={{
            color: '#667eea',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 18,
              height: 18,
              backgroundColor: '#fff',
              border: '2px solid #667eea',
              '&:hover': {
                boxShadow: '0 0 0 6px rgba(102, 126, 234, 0.16)',
              },
              '&.Mui-focusVisible': {
                boxShadow: '0 0 0 6px rgba(102, 126, 234, 0.16)',
              },
            },
            '& .MuiSlider-track': {
              border: 'none',
              backgroundColor: '#667eea',
            },
            '& .MuiSlider-rail': {
              opacity: 0.3,
              backgroundColor: '#cbd5e1',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#667eea',
              color: '#fff',
              fontWeight: 600,
              fontSize: '11px',
              padding: '3px 6px',
              borderRadius: '4px',
              '&::before': {
                display: 'none',
              },
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#cbd5e1',
              width: 2,
              height: 6,
            },
            '& .MuiSlider-markLabel': {
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 500,
              top: '20px',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {value[0]}年 ~ {value[1]}年
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
