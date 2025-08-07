import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Badge,
  LinearProgress,
  Divider,
  Stack,
  Avatar,
  ListItemText,
  ListItemAvatar,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  CardActions,
  Slide,
  Zoom,
  Fade,
  Skeleton,
  Backdrop,
  useScrollTrigger,
  AppBar,
  Toolbar,
  Snackbar,
  SnackbarContent,
  Breadcrumbs,
  Link,
  CardHeader,
  CardMedia,
  Collapse,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Search,
  FilterList,
  CheckCircle,
  Schedule,
  LocalShipping,
  Person,
  Business,
  Phone,
  LocationOn,
  Euro,
  CalendarToday,
  Refresh,
  TrendingUp,
  Assessment,
  ExpandMore,
  Add,
  Edit,
  Visibility,
  AccessTime,
  Place,
  AccountCircle,
  CloudSync,
  FileUpload,
  Dashboard,
  Analytics,
  Speed,
  TrendingDown,
  Insights,
  AutoGraph,
  Bolt,
  Star,
  StarBorder,
  FavoriteRounded,
  ThumbUp,
  Update,
  PieChart,
  BarChart,
  DonutLarge,
  ShowChart,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Share,
  Download,
  Print,
  FilterAlt,
  Sort,
  ViewModule,
  ViewList,
  ViewQuilt,
  GridView,
  TableView,
  Settings,
  Tune,
  AutoAwesome,
  Psychology,
  EmojiEvents,
  Verified,
  Security,
  Shield,
  AutoFixHigh,
  Diamond,
  Grade,
  Home,
  NavigateNext
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { getAllLivraisons, getStats, updateLivraisonStatus, getLivraisonsByMonth } from '../../../shared/api/domains/inventory/livraisonApi';
import ExcelUploader from '../../../shared/components/ExcelUploader';
import { triggerSync } from '../../../shared/api/domains/inventory/syncApi';

export default function LivraisonList() {
  const [livraisons, setLivraisons] = useState([]);
  const [filteredLivraisons, setFilteredLivraisons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Dialog
  const [selectedLivraison, setSelectedLivraison] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Synchronisation
  const [syncLoading, setSyncLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Notifications et interactions
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'table'
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  
  // Animation et scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [livraisons, searchTerm, selectedMonth, statusFilter, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [livraisonsData, statsData] = await Promise.all([
        getAllLivraisons({ limit: 1000 }),
        getStats()
      ]);
      
      setLivraisons(livraisonsData.livraisons || []);
      setStats(statsData);
    } catch (err) {
      console.error('❌ Erreur de chargement des livraisons:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...livraisons];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(livraison => 
        livraison.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livraison.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livraison.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livraison.demandeur?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par mois
    if (selectedMonth) {
      filtered = filtered.filter(livraison => livraison.mois === selectedMonth);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(livraison => 
        statusFilter === 'completed' ? livraison.fait : !livraison.fait
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLivraisons(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLivraisonStatus(id, newStatus);
      setLivraisons(prev => 
        prev.map(livraison => 
          livraison._id === id ? { ...livraison, fait: newStatus } : livraison
        )
      );
      if (selectedLivraison?._id === id) {
        setSelectedLivraison(prev => ({ ...prev, fait: newStatus }));
      }
    } catch (err) {
      console.error('❌ Erreur de mise à jour du statut:', err);
    }
  };

  const handleCardClick = (livraison) => {
    setSelectedLivraison(livraison);
    setDialogOpen(true);
  };

  const handleSyncClick = async () => {
    setSyncLoading(true);
    try {
      const result = await triggerSync();
      if (result.success) {
        await loadData();
        setSnackbar({ 
          open: true, 
          message: `✨ ${result.count} livraisons synchronisées avec succès !`, 
          severity: 'success' 
        });
      }
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
      setSnackbar({ 
        open: true, 
        message: `❌ Erreur: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadData();
    setUploadDialogOpen(false);
    setSnackbar({ 
      open: true, 
      message: '🎉 Données Excel synchronisées avec succès !', 
      severity: 'success' 
    });
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavoriteIds(newFavorites);
  };

  // Calculs mémorisés pour les performances
  const statsCalculated = useMemo(() => {
    if (!stats?.global) return null;
    
    const completionRate = stats.global.totalLivraisons > 0 
      ? (stats.global.totalTerminées / stats.global.totalLivraisons) * 100 
      : 0;
    
    const avgRevenue = stats.global.totalLivraisons > 0 
      ? stats.global.chiffreAffairesTotal / stats.global.totalLivraisons 
      : 0;
    
    return {
      ...stats.global,
      completionRate,
      avgRevenue,
      pendingCount: stats.global.totalLivraisons - stats.global.totalTerminées
    };
  }, [stats]);

  const deliveryTrends = useMemo(() => {
    const now = new Date();
    const thisMonth = filteredLivraisons.filter(l => 
      new Date(l.date).getMonth() === now.getMonth()
    );
    const completed = thisMonth.filter(l => l.fait);
    
    return {
      thisMonth: thisMonth.length,
      completed: completed.length,
      pending: thisMonth.length - completed.length,
      revenue: thisMonth.reduce((sum, l) => sum + (l.prix || 0), 0)
    };
  }, [filteredLivraisons]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price > 0 ? `${price.toFixed(2)} €` : 'Non facturé';
  };

  const getStatusColor = (fait) => {
    return fait ? 'success' : 'warning';
  };

  const getStatusText = (fait) => {
    return fait ? 'Terminé' : 'En cours';
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="xl">
          <Stack alignItems="center" spacing={4}>
            <Zoom in={loading}>
              <Avatar sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <LocalShipping sx={{ fontSize: 60, color: 'white' }} />
              </Avatar>
            </Zoom>
            
            <Typography variant="h3" color="white" fontWeight="bold" textAlign="center">
              🚀 Chargement des livraisons...
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <LinearProgress 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4)'
                  }
                }} 
              />
            </Box>
            
            <Stack direction="row" spacing={1}>
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i}
                  variant="circular" 
                  width={40} 
                  height={40}
                  animation="wave"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative'
    }}>
      {/* Floating App Bar */}
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.9)', 
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            color: 'text.primary'
          }}
        >
          <Toolbar>
            <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
              <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                <Home sx={{ mr: 0.5, fontSize: 20 }} />
                Accueil
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 0.5, fontSize: 20 }} />
                Livraisons
              </Typography>
            </Breadcrumbs>
            
            <Stack direction="row" spacing={1}>
              <IconButton onClick={handleSyncClick} disabled={syncLoading}>
                <CloudSync color={syncLoading ? 'disabled' : 'primary'} />
              </IconButton>
              <IconButton onClick={() => setUploadDialogOpen(true)}>
                <FileUpload color="secondary" />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
      </Slide>

      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        {/* Hero Section avec glassmorphism */}
        <Fade in timeout={1000}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              mb: 4,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.18)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                opacity: 0.1,
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' }
                }
              }}
            />
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              <Stack spacing={3} sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }}>
                    <LocalShipping sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h2" fontWeight="bold" sx={{ 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      Centre de Livraisons
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Verified color="primary" fontSize="small" />
                      Tableau de bord intelligent • Juin & Juillet 2025
                    </Typography>
                  </Box>
                </Stack>
                
                {statsCalculated && (
                  <Stack direction="row" spacing={3}>
                    <Chip 
                      icon={<EmojiEvents />} 
                      label={`${statsCalculated.completionRate.toFixed(1)}% Complété`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip 
                      icon={<ShowChart />} 
                      label={`${deliveryTrends.thisMonth} ce mois`}
                      color="info"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip 
                      icon={<AutoAwesome />} 
                      label="Données en temps réel"
                      color="warning"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Stack>
                )}
              </Stack>
              
              <Box sx={{ textAlign: 'center' }}>
                <Stack spacing={2}>
                  <ButtonGroup variant="contained" size="large">
                    <Button 
                      startIcon={<CloudSync />}
                      onClick={handleSyncClick}
                      disabled={syncLoading}
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        '&:hover': { background: 'linear-gradient(135deg, #5a6fd8, #6a4190)' }
                      }}
                    >
                      {syncLoading ? 'Sync...' : 'Synchroniser'}
                    </Button>
                    <Button 
                      startIcon={<FileUpload />}
                      onClick={() => setUploadDialogOpen(true)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                        '&:hover': { background: 'linear-gradient(135deg, #e084ec, #f04965)' }
                      }}
                    >
                      Excel
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Fade>

        {/* Analytics Dashboard Ultra-Moderne */}
        {statsCalculated && (
          <Fade in timeout={1200}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Total Livraisons avec animation */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Zoom in timeout={800}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                        background: 'rgba(255,255,255,0.9)'
                      },
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            width: 56, 
                            height: 56,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            animation: 'bounce 2s infinite'
                          }}>
                            <Dashboard sx={{ fontSize: 28 }} />
                          </Avatar>
                          <Chip 
                            icon={<TrendingUp />} 
                            label="+12%"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Stack>
                        
                        <Box>
                          <Typography variant="h3" fontWeight="bold" color="primary.main" sx={{ mb: 0.5 }}>
                            {statsCalculated.totalLivraisons || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Total Livraisons
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <ArrowUpward fontSize="inherit" />
                            Performance excellente
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    
                    {/* Effet de brillance */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      animation: 'shine 3s infinite',
                      '@keyframes shine': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' }
                      }
                    }} />
                  </Card>
                </Zoom>
              </Grid>

              {/* Terminées avec progress bar */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Zoom in timeout={1000}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      background: 'rgba(76, 175, 80, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(76, 175, 80, 0.3)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Avatar sx={{ 
                            bgcolor: 'success.main', 
                            width: 56, 
                            height: 56,
                            background: 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                          }}>
                            <EmojiEvents sx={{ fontSize: 28 }} />
                          </Avatar>
                          <Rating 
                            value={5} 
                            readOnly 
                            size="small"
                            icon={<Star fontSize="inherit" />}
                            emptyIcon={<StarBorder fontSize="inherit" />}
                          />
                        </Stack>
                        
                        <Box>
                          <Typography variant="h3" fontWeight="bold" color="success.main" sx={{ mb: 0.5 }}>
                            {statsCalculated.totalTerminées || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Terminées
                          </Typography>
                          
                          {/* Progress bar animée */}
                          <Box sx={{ mt: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Progression
                              </Typography>
                              <Typography variant="caption" fontWeight="bold" color="success.main">
                                {statsCalculated.completionRate.toFixed(1)}%
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={statsCalculated.completionRate}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  background: 'linear-gradient(90deg, #4CAF50, #66BB6A)'
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Chiffre d'affaires avec effet de compteur */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Zoom in timeout={1200}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      background: 'rgba(33, 150, 243, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(33, 150, 243, 0.3)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Avatar sx={{ 
                            bgcolor: 'info.main', 
                            width: 56, 
                            height: 56,
                            background: 'linear-gradient(135deg, #2196F3, #42A5F5)'
                          }}>
                            <AutoGraph sx={{ fontSize: 28 }} />
                          </Avatar>
                          <Chip 
                            icon={<Bolt />} 
                            label="Live"
                            color="info"
                            size="small"
                            sx={{ 
                              fontWeight: 'bold',
                              animation: 'pulse 2s infinite'
                            }}
                          />
                        </Stack>
                        
                        <Box>
                          <Typography variant="h3" fontWeight="bold" color="info.main" sx={{ mb: 0.5 }}>
                            {(statsCalculated.chiffreAffairesTotal || 0).toLocaleString()}€
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Chiffre d'Affaires
                          </Typography>
                          <Typography variant="caption" color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <ShowChart fontSize="inherit" />
                            Croissance continue
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Prix moyen avec sparkline effect */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Zoom in timeout={1400}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      background: 'rgba(255, 152, 0, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(255, 152, 0, 0.3)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Avatar sx={{ 
                            bgcolor: 'warning.main', 
                            width: 56, 
                            height: 56,
                            background: 'linear-gradient(135deg, #FF9800, #FFB74D)'
                          }}>
                            <Insights sx={{ fontSize: 28 }} />
                          </Avatar>
                          <Chip 
                            icon={<Diamond />} 
                            label="Premium"
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Stack>
                        
                        <Box>
                          <Typography variant="h3" fontWeight="bold" color="warning.main" sx={{ mb: 0.5 }}>
                            {(statsCalculated.moyennePrix || 0).toFixed(0)}€
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight="medium">
                            Prix Moyen
                          </Typography>
                          <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Grade fontSize="inherit" />
                            Valeur optimisée
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Control Panel Ultra-Moderne */}
        <Fade in timeout={1600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <Stack spacing={3}>
              {/* Header avec icônes modernes */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    width: 48, 
                    height: 48 
                  }}>
                    <Tune sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      Centre de Contrôle
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Filtres intelligents et actions rapides
                    </Typography>
                  </Box>
                </Stack>
                
                {/* Toggle de vue */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                  sx={{ 
                    '& .MuiToggleButton-root': { 
                      borderRadius: 2,
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ToggleButton value="grid">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                  <ToggleButton value="table">
                    <TableView />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              
              {/* Filtres en grille moderne */}
              <Grid container spacing={3} alignItems="center">
                {/* Recherche intelligente */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    placeholder="🔍 Recherche intelligente : client, entreprise, adresse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1 }}>
                          <Search fontSize="small" />
                        </Avatar>
                      )
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(10px)'
                      }
                    }}
                  />
                </Grid>
                
                {/* Filtres par chips */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                    {/* Filtre mois */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        displayEmpty
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.7)',
                          '& .MuiSelect-select': { 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                          }
                        }}
                      >
                        <MenuItem value="">
                          <CalendarToday fontSize="small" />
                          Tous les mois
                        </MenuItem>
                        <MenuItem value="juin">
                          <CalendarToday fontSize="small" color="primary" />
                          Juin 2025
                        </MenuItem>
                        <MenuItem value="juillet">
                          <CalendarToday fontSize="small" color="secondary" />
                          Juillet 2025
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Filtre statut */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.7)'
                        }}
                      >
                        <MenuItem value="all">
                          <Assessment fontSize="small" />
                          Tous
                        </MenuItem>
                        <MenuItem value="completed">
                          <CheckCircle fontSize="small" color="success" />
                          Terminé
                        </MenuItem>
                        <MenuItem value="pending">
                          <Schedule fontSize="small" color="warning" />
                          En cours
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Actions rapides */}
                    <ButtonGroup variant="contained" size="small">
                      <Button
                        onClick={loadData}
                        startIcon={<Refresh />}
                        sx={{ 
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                          '&:hover': { background: 'linear-gradient(135deg, #45a049, #5cb85c)' }
                        }}
                      >
                        Actualiser
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Grid>
              </Grid>
              
              {/* Statistiques rapides */}
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip 
                  icon={<FilterAlt />} 
                  label={`${filteredLivraisons.length} résultats`}
                  color="primary"
                  variant="outlined"
                />
                {selectedMonth && (
                  <Chip 
                    icon={<CalendarToday />} 
                    label={`Mois: ${selectedMonth}`}
                    onDelete={() => setSelectedMonth('')}
                    color="info"
                  />
                )}
                {statusFilter !== 'all' && (
                  <Chip 
                    icon={statusFilter === 'completed' ? <CheckCircle /> : <Schedule />} 
                    label={`Statut: ${statusFilter === 'completed' ? 'Terminé' : 'En cours'}`}
                    onDelete={() => setStatusFilter('all')}
                    color={statusFilter === 'completed' ? 'success' : 'warning'}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Galerie de Livraisons Ultra-Moderne */}
        <Fade in timeout={2000}>
          <Box>
            {viewMode === 'grid' && (
              <Grid container spacing={3}>
                {filteredLivraisons.map((livraison, index) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={livraison._id}>
                    <Zoom in timeout={800 + index * 100}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.8)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 4,
                          border: '1px solid rgba(255,255,255,0.3)',
                          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.02)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                            background: 'rgba(255,255,255,0.95)',
                            '& .card-overlay': {
                              opacity: 1
                            },
                            '& .favorite-btn': {
                              transform: 'scale(1.2)',
                              opacity: 1
                            }
                          }
                        }}
                        onClick={() => handleCardClick(livraison)}
                      >
                        {/* Overlay avec gradient */}
                        <Box
                          className="card-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: livraison.fait 
                              ? 'linear-gradient(90deg, #4CAF50, #66BB6A)'
                              : 'linear-gradient(90deg, #FF9800, #FFB74D)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                        />
                        
                        <CardHeader
                          avatar={
                            <Avatar sx={{ 
                              background: livraison.fait 
                                ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                                : 'linear-gradient(135deg, #FF9800, #FFB74D)',
                              animation: 'pulse 2s infinite'
                            }}>
                              {livraison.fait ? <CheckCircle /> : <Schedule />}
                            </Avatar>
                          }
                          action={
                            <Stack direction="row" spacing={1}>
                              <IconButton 
                                className="favorite-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(livraison._id);
                                }}
                                sx={{ 
                                  opacity: 0.6, 
                                  transition: 'all 0.3s ease',
                                  color: favoriteIds.has(livraison._id) ? '#FF6B6B' : 'grey.400'
                                }}
                              >
                                {favoriteIds.has(livraison._id) ? <FavoriteRounded /> : <StarBorder />}
                              </IconButton>
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </Stack>
                          }
                          title={
                            <Typography variant="h6" fontWeight="bold" noWrap>
                              {livraison.client || livraison.entreprise || 'Client non spécifié'}
                            </Typography>
                          }
                          subheader={
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                              <CalendarToday fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(livraison.date)}
                              </Typography>
                            </Stack>
                          }
                          sx={{ pb: 1 }}
                        />

                        <CardContent sx={{ pt: 0 }}>
                          {/* Informations avec icônes modernes */}
                          <Stack spacing={2}>
                            {livraison.entreprise && livraison.client && (
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.main' }}>
                                  <Business fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    Entreprise
                                  </Typography>
                                  <Typography variant="body1" noWrap>
                                    {livraison.entreprise}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}
                            
                            {livraison.adresse && (
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                                  <Place fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    Adresse
                                  </Typography>
                                  <Typography variant="body1" noWrap>
                                    {livraison.adresse}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}
                            
                            {livraison.demandeur && (
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                                  <AccountCircle fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    Demandeur
                                  </Typography>
                                  <Typography variant="body1" noWrap>
                                    {livraison.demandeur}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions sx={{ p: 3, pt: 0 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            {/* Prix avec effet premium */}
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                Montant
                              </Typography>
                              <Typography 
                                variant="h5" 
                                fontWeight="bold"
                                sx={{ 
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }}
                              >
                                {formatPrice(livraison.prix)}
                              </Typography>
                            </Box>
                            
                            {/* Badges et indicateurs */}
                            <Stack direction="row" spacing={1} alignItems="center">
                              {livraison.nbColis > 0 && (
                                <Chip 
                                  icon={<LocalShipping />}
                                  label={livraison.nbColis}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                              {livraison.telephone && (
                                <Tooltip title="Contact disponible">
                                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'success.light' }}>
                                    <Phone fontSize="small" />
                                  </Avatar>
                                </Tooltip>
                              )}
                              <Chip
                                label={livraison.fait ? 'Terminé' : 'En cours'}
                                color={livraison.fait ? 'success' : 'warning'}
                                size="small"
                                sx={{ 
                                  fontWeight: 'bold',
                                  animation: !livraison.fait ? 'pulse 2s infinite' : 'none'
                                }}
                              />
                            </Stack>
                          </Stack>
                        </CardActions>
                        
                        {/* Effet de shine au hover */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          transition: 'left 0.6s ease',
                          pointerEvents: 'none',
                          '.card:hover &': {
                            left: '100%'
                          }
                        }} />
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Vue Liste Moderne */}
            {viewMode === 'list' && (
              <Stack spacing={2}>
                {filteredLivraisons.map((livraison, index) => (
                  <Slide key={livraison._id} in timeout={600 + index * 100} direction="up">
                    <Card 
                      elevation={0}
                      sx={{ 
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          background: 'rgba(255,255,255,0.95)'
                        }
                      }}
                      onClick={() => handleCardClick(livraison)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Avatar sx={{ 
                            width: 60, 
                            height: 60,
                            background: livraison.fait 
                              ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                              : 'linear-gradient(135deg, #FF9800, #FFB74D)'
                          }}>
                            {livraison.fait ? <CheckCircle sx={{ fontSize: 30 }} /> : <Schedule sx={{ fontSize: 30 }} />}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {livraison.client || livraison.entreprise || 'Client non spécifié'}
                            </Typography>
                            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                📅 {formatDate(livraison.date)}
                              </Typography>
                              {livraison.adresse && (
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  📍 {livraison.adresse}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                          
                          <Stack alignItems="end" spacing={1}>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                              {formatPrice(livraison.prix)}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {livraison.nbColis > 0 && (
                                <Chip 
                                  icon={<LocalShipping />}
                                  label={livraison.nbColis}
                                  size="small"
                                  color="primary"
                                />
                              )}
                              <Chip
                                label={livraison.fait ? 'Terminé' : 'En cours'}
                                color={livraison.fait ? 'success' : 'warning'}
                                size="small"
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Stack>
            )}
          </Box>
        </Fade>

        {/* Message si aucune livraison */}
        {filteredLivraisons.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.100', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <LocalShipping color="disabled" />
            </Avatar>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucune livraison trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de modifier vos filtres de recherche
            </Typography>
          </Box>
        )}

        {/* Dialog détail moderne */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, p: 1 }
          }}
        >
          {selectedLivraison && (
            <>
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      Détail de la livraison
                    </span>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {formatDate(selectedLivraison.date)}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedLivraison.fait}
                        onChange={(e) => handleStatusChange(selectedLivraison._id, e.target.checked)}
                        color="success"
                      />
                    }
                    label={getStatusText(selectedLivraison.fait)}
                  />
                </Stack>
              </DialogTitle>
              
              <Divider />
              
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          👤 Informations client
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Client:</strong> {selectedLivraison.client || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Entreprise:</strong> {selectedLivraison.entreprise || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Téléphone:</strong> {selectedLivraison.telephone || 'Non spécifié'}
                          </Typography>
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          📍 Livraison
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Adresse:</strong> {selectedLivraison.adresse || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Accès:</strong> {selectedLivraison.accesLivraison || 'Non spécifié'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          💰 Facturation
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Prix:</strong> {formatPrice(selectedLivraison.prix)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Référence devis:</strong> {selectedLivraison.referenceDevis || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Nombre de colis:</strong> {selectedLivraison.nbColis || 0}
                          </Typography>
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          ℹ️ Autres informations
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Demandeur:</strong> {selectedLivraison.demandeur || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Client prévenu:</strong> {selectedLivraison.clientPrevenu || 'Non spécifié'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  {selectedLivraison.infos && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                        📝 Informations complémentaires
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="body2">
                          {selectedLivraison.infos}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              
              <Divider />
              
              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={() => setDialogOpen(false)}
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Fermer
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Dialog d'upload Excel */}
        <Dialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              📁 Synchronisation depuis Excel
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <ExcelUploader onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
          
          <DialogActions>
            <Button 
              onClick={() => setUploadDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button pour actions rapides */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
            }
          }}
          onClick={handleSyncClick}
        >
          <CloudSync />
        </Fab>

        {/* Snackbar pour notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 3,
              fontWeight: 'bold',
              '&.MuiAlert-filledSuccess': {
                background: 'linear-gradient(135deg, #4CAF50, #66BB6A)'
              },
              '&.MuiAlert-filledError': {
                background: 'linear-gradient(135deg, #f44336, #ef5350)'
              },
              '&.MuiAlert-filledInfo': {
                background: 'linear-gradient(135deg, #2196F3, #42A5F5)'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
