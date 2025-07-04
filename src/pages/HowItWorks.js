import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AppBarMenu from "../components/AppBarMenu";
import YardIcon from "@mui/icons-material/Yard";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StraightenIcon from "@mui/icons-material/Straighten";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ProcessSection from "../components/ProcessSection";
import ScrollTriggeredSection from "../components/ScrollTriggeredSection";

const HowItWorks = () => (
  <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
    <AppBarMenu />
    <Container maxWidth="xl" sx={{ pt: 12 }}>
      {/* Platform Overview */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: { xs: 6, md: 8 },
          p: { xs: 2, md: 4 },
          background: "rgba(255,255,255,0.92)",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 2,
            textAlign: "center",
          }}
        >
          ApeForest - Controle de Cadastro e Monitoramento das Árvores
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
          Plataforma digital completa desenvolvida para gerenciar projetos de
          reflorestamento de forma eficiente e transparente. O sistema conecta
          agricultores, empresas e especialistas em um ambiente colaborativo
          para o monitoramento e controle de plantios florestais.
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          Ao mapear áreas de plantio, documentar espécies e monitorar o
          desenvolvimento das plantas, garantimos transparência e dados
          confiáveis para todos os envolvidos.
        </Typography>
      </Box>

      {/* User Profiles - Keeping the original structure */}
      <ScrollTriggeredSection>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            width: "100%",
          }}
        >
          <ProcessSection>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <YardIcon sx={{ fontSize: 32 }} /> Para Agricultores
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: <MapIcon />,
                  title: "Mapeie Suas Áreas",
                  description:
                    "Cadastre e gerencie seus locais de plantio de forma simples e intuitiva em nosso mapa interativo.",
                },
                {
                  icon: <DescriptionIcon />,
                  title: "Documente Sua Biodiversidade",
                  description:
                    "Registre as espécies plantadas, técnicas utilizadas e o impacto positivo no ecossistema local.",
                },
                {
                  icon: <HandshakeIcon />,
                  title: "Conecte-se",
                  description:
                    "Receba propostas de empresas interessadas em apoiar seus projetos de biodiversidade.",
                },
              ].map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4caf50, #81c784)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography
              color="text.secondary"
              sx={{ mt: 4, fontSize: "1.05rem" }}
            >
              Ao participar, agricultores ampliam sua visibilidade, recebem
              apoio técnico e podem acessar novos recursos financeiros para
              expandir práticas regenerativas. O acompanhamento contínuo e a
              documentação transparente valorizam o trabalho do campo e
              facilitam parcerias duradouras.
            </Typography>
          </ProcessSection>
          <ProcessSection>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <BusinessIcon sx={{ fontSize: 32 }} /> Para Empresas
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: <SearchIcon />,
                  title: "Encontre Parceiros",
                  description:
                    "Descubra agricultores próximos à sua região que compartilham dos mesmos valores de sustentabilidade.",
                },
                {
                  icon: <AssessmentIcon />,
                  title: "Avalie Projetos",
                  description:
                    "Analise detalhadamente os projetos de biodiversidade e seu potencial impacto ambiental.",
                },
                {
                  icon: <CheckCircleOutlineIcon />,
                  title: "Faça a Diferença",
                  description:
                    "Estabeleça parcerias duradouras e contribua diretamente para a restauração dos ecossistemas.",
                },
              ].map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4caf50, #81c784)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography
              color="text.secondary"
              sx={{ mt: 4, fontSize: "1.05rem" }}
            >
              Empresas têm acesso a projetos autênticos, com dados confiáveis e
              monitoramento contínuo, compensação de CO2 e fortalecimento da
              reputação sustentável. O apoio direto a iniciativas locais gera
              impacto mensurável e contribui para um futuro mais verde e
              resiliente.
            </Typography>
          </ProcessSection>
        </Box>
      </ScrollTriggeredSection>

      {/* Detailed Monitoring Process */}
      <ScrollTriggeredSection>
        <Box
          sx={{
            maxWidth: 1000,
            mx: "auto",
            mb: { xs: 6, md: 8 },
            p: { xs: 2, md: 4 },
            background: "rgba(255,255,255,0.92)",
            borderRadius: 4,
            boxShadow: 2,
            mt: 10,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 4, textAlign: "center", color: "primary.main" }}
          >
            Como Funciona o Monitoramento
          </Typography>

          {/* Step 1: Project Registration */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  1
                </Avatar>
                <Typography variant="h6">Cadastro do Projeto</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Definição da Área
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <MapIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Mapeamento Interativo"
                        secondary="O agricultor define a área geográfica no mapa usando coordenadas GPS"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <YardIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Especificação de Espécies"
                        secondary="Cadastro detalhado das espécies que serão plantadas (nome científico, quantidade)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Cronograma de Plantio"
                        secondary="Definição das datas de plantio e início do monitoramento"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Step 2: Data Collection */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  2
                </Avatar>
                <Typography variant="h6">
                  Coleta de Dados Biométricos
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Medições Obrigatórias
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <StraightenIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Altura da Árvore"
                        secondary="Medida em metros usando fita métrica ou clinômetro"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Diâmetro do Peito (DAP)"
                        secondary="Medida em centímetros a 1,30m do solo"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MapIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Localização"
                        secondary="Marque a localização da árvore no mapa para visualização e controle geográfico do plantio"
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: "info.50" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Frequência de Coleta:
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Primeiros 2 anos:</strong> A cada 6 meses
                      <br />• <strong>Após 2 anos:</strong> Anualmente
                      {/* <br />• <strong>Fotografias:</strong> Sempre que houver
                      mudanças significativas */}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Step 3: Sampling Strategy */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  3
                </Avatar>
                <Typography variant="h6">Estratégia de Amostragem</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Sistema de Zonas de Amostra (15-20% do total)
              </Typography>

              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Espécie</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Total Plantado</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Árvores Monitoradas (20%)</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Aroeira-vermelha</TableCell>
                      <TableCell>20 árvores</TableCell>
                      <TableCell>3-4 árvores</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Guajuvira</TableCell>
                      <TableCell>15 árvores</TableCell>
                      <TableCell>2-3 árvores</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cedro</TableCell>
                      <TableCell>12 árvores</TableCell>
                      <TableCell>2-3 árvores</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Critérios de Seleção da Amostra:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Distribuição representativa na área de plantio" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Inclusão de árvores com diferentes condições de crescimento" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Marcação permanente das árvores selecionadas para acompanhamento" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Step 4: Documentation */}
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  4
                </Avatar>
                <Typography variant="h6">Documentação e Relatórios</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Documentação Obrigatória
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PhotoCameraIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Fotografias de árvores da Zonas de Amostra"
                        secondary="Foto de cada árvore da amostra com identificação única"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DashboardIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Fotografia por Espécie"
                        secondary="Foto geral representativa de cada espécie no projeto"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Planilhas de Medição"
                        secondary="Registro sistemático de altura e diâmetro com datas"
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: "success.50" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Relatórios Gerados:
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Relatório de Crescimento:</strong> Evolução das
                      medidas ao longo do tempo
                      <br />• <strong>Relatório de Sobrevivência:</strong> Taxa
                      de sobrevivência das árvores
                      <br />• <strong>Relatório Fotográfico:</strong>{" "}
                      Documentação visual do desenvolvimento
                      <br />• <strong>Dashboard Interativo:</strong> Métricas em
                      tempo real para empresas
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </ScrollTriggeredSection>

      {/* Call to Action */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: { xs: 6, md: 8 },
          p: { xs: 2, md: 4 },
          background: "rgba(255,255,255,0.92)",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          Junte-se a essa rede de transformação! Cada conexão entre agricultores
          e empresas é um passo a mais para restaurar florestas, proteger a
          biodiversidade e enfrentar as mudanças climáticas. Sua participação
          faz a diferença.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default HowItWorks;
