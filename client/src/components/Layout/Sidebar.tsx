import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Assessment as ScoringIcon,
  Lightbulb as RecommendationsIcon,
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'BWA Upload', icon: <UploadIcon />, path: '/upload' },
  { text: 'Scoring', icon: <ScoringIcon />, path: '/scoring' },
  { text: 'Empfehlungen', icon: <RecommendationsIcon />, path: '/recommendations' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a2e',
          color: 'white',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 48, color: '#4fc3f7', mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          BWA Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Kleinunternehmer
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* User Profile */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#4fc3f7' }}>GS</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Gordian Schmitz
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Unternehmer
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Navigation */}
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(79, 195, 247, 0.1)',
                },
                ...(location.pathname === item.path && {
                  backgroundColor: '#4fc3f7',
                  color: '#1a1a2e',
                  '&:hover': {
                    backgroundColor: '#29b6f6',
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? '#1a1a2e' : '#4fc3f7',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2024 BWA Dashboard
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;